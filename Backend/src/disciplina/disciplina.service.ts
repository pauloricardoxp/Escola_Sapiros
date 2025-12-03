import { In } from 'typeorm';
import {Injectable,NotFoundException,BadRequestException,ForbiddenException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disciplina } from './entities/disciplina.entity';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { Turma } from '../turma/entities/turma.entity';
import { Professor } from '../professor/entities/professor.entity';
import { Usuario, Role } from '../usuario/entities/usuario.entity';

@Injectable()
export class DisciplinaService {
  constructor(
    @InjectRepository(Disciplina)
    private readonly disciplinaRepository: Repository<Disciplina>,
    @InjectRepository(Turma)
    private readonly turmaRepository: Repository<Turma>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

 

  private async findDisciplinaOrFail(id: string): Promise<Disciplina> {
    const disciplina = await this.disciplinaRepository.findOne({
      where: { id_disciplina: id },
      relations: ['turmas'],
    });
    if (!disciplina) throw new NotFoundException(`Disciplina com ID ${id} não encontrada`);
    return disciplina;
  }

  private async findProfessorByUsuarioId(usuarioId: string): Promise<Professor | null> {
    return this.professorRepository.findOne({
      where: { usuario: { id: usuarioId } as any },
      relations: ['turmas', 'turmas.disciplinas'],
    });
  }

  private async professorMinistraDisciplina(professor: Professor, disciplinaId: string): Promise<boolean> {
    if (!professor) return false;
    for (const t of professor.turmas || []) {
      if (t.disciplinas && t.disciplinas.some(d => d.id_disciplina === disciplinaId)) return true;
      if (!t.disciplinas || t.disciplinas.length === 0) {
        const turmaFull = await this.turmaRepository.findOne({
          where: { id_turma: t.id_turma },
          relations: ['disciplinas'],
        });
        if (turmaFull && turmaFull.disciplinas.some(d => d.id_disciplina === disciplinaId)) return true;
      }
    }
    return false;
  }

  private assertCanManage(user: any): void {
    if (!user) throw new ForbiddenException('Usuário não autenticado');
    if (user.role !== Role.COORDENACAO) {
      throw new ForbiddenException('Apenas coordenação pode executar esta ação');
    }
  }


  /**
   * Cria disciplina. Apenas coordenação.
   * user: req.user (pode ser any para evitar erro de tipagem do Request)
   */
  async create(createDisciplinaDto: CreateDisciplinaDto, user: any): Promise<Disciplina> {
    this.assertCanManage(user);

    const { codigo, nome_disciplina, descricao_turma, cargaHoraria } = createDisciplinaDto;

    if (!codigo || !nome_disciplina || cargaHoraria === undefined) {
      throw new BadRequestException('codigo, nome_disciplina e cargaHoraria são obrigatórios');
    }

    const exists = await this.disciplinaRepository.findOne({ where: { codigo } });
    if (exists) throw new BadRequestException(`Disciplina com código ${codigo} já existe`);

    const disciplina = this.disciplinaRepository.create({
      codigo,
      nome_disciplina,
      descricao_turma: descricao_turma ?? undefined,
      cargaHoraria,
    });

    return this.disciplinaRepository.save(disciplina);
  }

  /**
   * Lista disciplinas.
   * - Coordenação vê todas.
   * - Professores e alunos também podem listar; professores podem receber disciplinas que ministram (service pode filtrar se necessário).
   * user: req.user
   */
  async findAll(user: any): Promise<Disciplina[]> {
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    // Coordenação vê tudo
    if (user.role === Role.COORDENACAO) {
      return this.disciplinaRepository.find({ relations: ['turmas'] });
    }

    // Professor: opcionalmente retornar apenas disciplinas que ministra
    if (user.role === Role.PROFESSOR) {
      const professor = await this.findProfessorByUsuarioId(user.id);
      if (!professor) throw new ForbiddenException('Professor não encontrado para o usuário autenticado');

      // coletar disciplinas das turmas do professor
      const turmas = await this.turmaRepository.find({
        where: { professor: { id_professor: professor.id_professor } as any },
        relations: ['disciplinas'],
      });
      const disciplinaIds = turmas.flatMap(t => (t.disciplinas || []).map(d => d.id_disciplina));
      if (disciplinaIds.length === 0) return [];
      return this.disciplinaRepository.find({
        where: { id_disciplina: In(disciplinaIds) },
        relations: ['turmas']
      });
    }

    // Aluno: listar todas (ou aplicar filtros se desejar)
    if (user.role === Role.ALUNO) {
      return this.disciplinaRepository.find({ relations: ['turmas'] });
    }

    throw new ForbiddenException('Role não autorizada para listar disciplinas');
  }

  /**
   * Busca disciplina por id. Valida acesso básico:
   * - Coordenação: sempre
   * - Professor: somente se ministra a disciplina
   * - Aluno: pode ver
   */
  async findOne(id: string, user: any): Promise<Disciplina> {
    const disciplina = await this.findDisciplinaOrFail(id);

    if (!user) throw new ForbiddenException('Usuário não autenticado');

    if (user.role === Role.COORDENACAO) return disciplina;

    if (user.role === Role.PROFESSOR) {
      const professor = await this.findProfessorByUsuarioId(user.id);
      if (!professor) throw new ForbiddenException('Professor não encontrado para o usuário autenticado');
      const ok = await this.professorMinistraDisciplina(professor, disciplina.id_disciplina);
      if (!ok) throw new ForbiddenException('Professor não autorizado para acessar esta disciplina');
      return disciplina;
    }

    if (user.role === Role.ALUNO) return disciplina;

    throw new ForbiddenException('Role não autorizada');
  }

  /**
   * Atualiza disciplina. Apenas coordenação.
   */
  async update(id: string, updateDisciplinaDto: UpdateDisciplinaDto, user: any): Promise<Disciplina> {
    this.assertCanManage(user);

    const disciplina = await this.findDisciplinaOrFail(id);

    if (updateDisciplinaDto.codigo !== undefined && updateDisciplinaDto.codigo !== disciplina.codigo) {
      const exists = await this.disciplinaRepository.findOne({ where: { codigo: updateDisciplinaDto.codigo } });
      if (exists) throw new BadRequestException(`Outra disciplina com código ${updateDisciplinaDto.codigo} já existe`);
      disciplina.codigo = updateDisciplinaDto.codigo;
    }

    if (updateDisciplinaDto.nome_disciplina !== undefined) disciplina.nome_disciplina = updateDisciplinaDto.nome_disciplina;
    if (updateDisciplinaDto.descricao_turma !== undefined) disciplina.descricao_turma = updateDisciplinaDto.descricao_turma;
    if (updateDisciplinaDto.cargaHoraria !== undefined) disciplina.cargaHoraria = updateDisciplinaDto.cargaHoraria;

    return this.disciplinaRepository.save(disciplina);
  }

  /**
   * Remove disciplina. Apenas coordenação.
   * Recomenda-se soft delete em produção; aqui removemos fisicamente.
   */
  async remove(id: string, user: any): Promise<void> {
    this.assertCanManage(user);

    const disciplina = await this.findDisciplinaOrFail(id);

    // opcional: checar se existem turmas/relacionamentos que impedem remoção
    const turmas = await this.turmaRepository
      .createQueryBuilder('t')
      .leftJoin('t.disciplinas', 'd')
      .where('d.id_disciplina = :did', { did: id })
      .getMany();
    if (turmas.length > 0) {
      throw new BadRequestException('Não é possível remover disciplina vinculada a turmas. Remova vínculos primeiro.');
    }

    await this.disciplinaRepository.remove(disciplina);
  }
}
