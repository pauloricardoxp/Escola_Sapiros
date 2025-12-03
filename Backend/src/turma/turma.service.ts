import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { Turma } from './entities/turma.entity';
import { Aluno } from '../aluno/entities/aluno.entity';
import { Disciplina } from '../disciplina/entities/disciplina.entity';
import { Professor } from '../professor/entities/professor.entity';

@Injectable()
export class TurmaService {
  constructor(
    @InjectRepository(Turma)
    private readonly turmaRepository: Repository<Turma>,
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
    @InjectRepository(Disciplina)
    private readonly disciplinaRepository: Repository<Disciplina>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) {}

  private validateDates(dataInicio: string, dataFim: string): { inicio: Date; fim: Date } {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
      throw new BadRequestException('Datas inválidas');
    }

    if (fim < inicio) {
      throw new BadRequestException('Data fim não pode ser anterior à data início');
    }

    return { inicio, fim };
  }

  private async loadAlunos(alunosIds?: string[]): Promise<Aluno[]> {
    if (!alunosIds || alunosIds.length === 0) {
      return [];
    }

    const alunos = await this.alunoRepository.find({
      where: { matricula_aluno: In(alunosIds) },
    });

    if (alunos.length !== alunosIds.length) {
      throw new NotFoundException('Um ou mais alunos não foram encontrados');
    }

    return alunos;
  }

  private async loadDisciplinas(disciplinasIds?: string[]): Promise<Disciplina[]> {
    if (!disciplinasIds || disciplinasIds.length === 0) {
      return [];
    }

    // Ajuste: usar o nome do campo primário da entidade Disciplina.
    // Se sua entidade usa `id_disciplina` como PK, mantenha; caso use `id`, altere para `id`.
    const disciplinas = await this.disciplinaRepository.find({
      where: { id_disciplina: In(disciplinasIds) as any },
    });

    if (disciplinas.length !== disciplinasIds.length) {
      throw new NotFoundException('Uma ou mais disciplinas não foram encontradas');
    }

    return disciplinas;
  }

  private async loadProfessor(professorId?: string): Promise<Professor | undefined> {
    if (!professorId) {
      return undefined;
    }

    const professor = await this.professorRepository.findOneBy({ id: professorId } as any);
    if (!professor) {
      throw new NotFoundException(`Professor com ID ${professorId} não encontrado`);
    }
    return professor;
  }

  async create(createTurmaDto: CreateTurmaDto): Promise<Turma> {
    const { inicio, fim } = this.validateDates(createTurmaDto.dataInicio, createTurmaDto.dataFim);

    const turma = this.turmaRepository.create({
      nome_turma: createTurmaDto.nome_turma,
      anoLetivo: createTurmaDto.anoLetivo,
      periodo: createTurmaDto.periodo,
      dataInicio: inicio,
      dataFim: fim,
      descricao: createTurmaDto.descricao,
      ativa: createTurmaDto.ativa ?? true,
    });

    turma.professor = await this.loadProfessor(createTurmaDto.professorId);
    turma.alunos = await this.loadAlunos(createTurmaDto.alunosIds);
    turma.disciplinas = await this.loadDisciplinas(createTurmaDto.disciplinasIds);

    return this.turmaRepository.save(turma);
  }

  async findAll(): Promise<Turma[]> {
    return this.turmaRepository.find({
      relations: ['alunos', 'disciplinas', 'professor', 'avisos'],
      order: { nome_turma: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Turma> {
    const turma = await this.turmaRepository.findOne({
      where: { id_turma: id },
      relations: ['alunos', 'disciplinas', 'professor', 'avisos'],
    });

    if (!turma) {
      throw new NotFoundException(`Turma com ID ${id} não encontrada`);
    }

    return turma;
  }

  async update(id: string, updateTurmaDto: UpdateTurmaDto): Promise<Turma> {
    const turma = await this.findOne(id);

    // Datas: se qualquer uma for fornecida, valide usando os valores atuais como fallback
    if (updateTurmaDto.dataInicio !== undefined || updateTurmaDto.dataFim !== undefined) {
      const inicioStr = updateTurmaDto.dataInicio ?? turma.dataInicio.toISOString();
      const fimStr = updateTurmaDto.dataFim ?? turma.dataFim.toISOString();
      const { inicio, fim } = this.validateDates(inicioStr, fimStr);
      turma.dataInicio = inicio;
      turma.dataFim = fim;
    }

    if (updateTurmaDto.nome_turma !== undefined) turma.nome_turma = updateTurmaDto.nome_turma;
    if (updateTurmaDto.anoLetivo !== undefined) turma.anoLetivo = updateTurmaDto.anoLetivo;
    if (updateTurmaDto.periodo !== undefined) turma.periodo = updateTurmaDto.periodo;
    if (updateTurmaDto.descricao !== undefined) turma.descricao = updateTurmaDto.descricao;
    if (updateTurmaDto.ativa !== undefined) turma.ativa = updateTurmaDto.ativa;

    // professorId pode ser undefined (não alterar), null/'' (desvincular) ou um id válido
    if (updateTurmaDto.professorId !== undefined) {
      if (updateTurmaDto.professorId) {
        turma.professor = await this.loadProfessor(updateTurmaDto.professorId);
      } else {
        turma.professor = undefined;
      }
    }

    // Para permitir limpar a lista, checar !== undefined (assim [] limpa)
    if (updateTurmaDto.alunosIds !== undefined) {
      turma.alunos = await this.loadAlunos(updateTurmaDto.alunosIds);
    }

    if (updateTurmaDto.disciplinasIds !== undefined) {
      turma.disciplinas = await this.loadDisciplinas(updateTurmaDto.disciplinasIds);
    }

    return this.turmaRepository.save(turma);
  }

  async remove(id: string): Promise<void> {
    const turma = await this.findOne(id);
    await this.turmaRepository.remove(turma);
  }
}
