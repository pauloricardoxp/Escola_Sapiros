import { Injectable, NotFoundException,BadRequestException,ForbiddenException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nota } from './entities/nota.entity';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { FilterNotaDto } from './dto/filter-nota.dto';
import { Aluno } from '../aluno/entities/aluno.entity';
import { Disciplina } from '../disciplina/entities/disciplina.entity';
import { Turma } from '../turma/entities/turma.entity';
import { Professor } from '../professor/entities/professor.entity';
import { Usuario, Role } from '../usuario/entities/usuario.entity';

@Injectable()
export class NotaService {
  constructor(
    @InjectRepository(Nota)
    private readonly notaRepository: Repository<Nota>,
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
    @InjectRepository(Disciplina)
    private readonly disciplinaRepository: Repository<Disciplina>,
    @InjectRepository(Turma)
    private readonly turmaRepository: Repository<Turma>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // --- Helpers ---

  private async findAlunoByMatricula(matricula: string): Promise<Aluno> {
    const aluno = await this.alunoRepository.findOne({
      where: { matricula_aluno: matricula },
    });
    if (!aluno) throw new NotFoundException(`Aluno com matrícula ${matricula} não encontrado`);
    return aluno;
  }

  private async findDisciplinaById(id: string): Promise<Disciplina> {
    const disciplina = await this.disciplinaRepository.findOne({
      where: { id_disciplina: id },
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
      if (t.disciplinas && t.disciplinas.some(d => d.id_disciplina === disciplinaId)) {
        return true;
      }
      if (!t.disciplinas || t.disciplinas.length === 0) {
        const turmaFull = await this.turmaRepository.findOne({
          where: { id_turma: t.id_turma },
          relations: ['disciplinas'],
        });
        if (turmaFull && turmaFull.disciplinas.some(d => d.id_disciplina === disciplinaId)) {
          return true;
        }
      }
    }
    return false;
  }

  private async assertCanReadNota(nota: Nota, user: any): Promise<void> {
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    if (user.role === Role.COORDENACAO) return;

    if (user.role === Role.PROFESSOR) {
      const professor = await this.findProfessorByUsuarioId(user.id);
      if (!professor) throw new ForbiddenException('Professor não encontrado para o usuário autenticado');
      const ok = await this.professorMinistraDisciplina(professor, nota.disciplina.id_disciplina);
      if (!ok) throw new ForbiddenException('Professor não autorizado para acessar esta nota');
      return;
    }

    if (user.role === Role.ALUNO) {
      if (!nota.aluno) throw new NotFoundException('Nota sem aluno vinculado');
      if (nota.aluno.matricula_aluno !== user.matricula_aluno) {
        throw new ForbiddenException('Aluno não autorizado a ver esta nota');
      }
      return;
    }

    throw new ForbiddenException('Role não autorizada');
  }

  private async assertCanModifyNota(nota: Nota | null, user: any, disciplinaIdForCreate?: string): Promise<void> {
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    if (user.role === Role.COORDENACAO) return;

    if (user.role === Role.PROFESSOR) {
      const professor = await this.findProfessorByUsuarioId(user.id);
      if (!professor) throw new ForbiddenException('Professor não encontrado para o usuário autenticado');

      if (nota) {
        const ok = await this.professorMinistraDisciplina(professor, nota.disciplina.id_disciplina);
        if (!ok) throw new ForbiddenException('Professor não autorizado para modificar esta nota');
        return;
      }

      if (!disciplinaIdForCreate) throw new BadRequestException('Disciplina é obrigatória para criação de nota');
      const ministra = await this.professorMinistraDisciplina(professor, disciplinaIdForCreate);
      if (!ministra) throw new ForbiddenException('Professor não autorizado para criar nota nesta disciplina');
      return;
    }

    throw new ForbiddenException('Apenas coordenação e professores podem modificar notas');
  }

  // --- CRUD ---

  /**
   * Cria uma nota.
   * createNotaDto: { valor, tipoAvaliacao?, data, observacao?, alunoId (matrícula), disciplinaId }
   * user: req.user (contendo id, role, matricula_aluno quando aplicável)
   */
  async create(createNotaDto: CreateNotaDto, user: any): Promise<Nota> {
    const { alunoId, disciplinaId, valor, tipoAvaliacao, data, observacao } = createNotaDto;

    if (!alunoId) throw new BadRequestException('alunoId (matrícula) é obrigatório');
    if (!disciplinaId) throw new BadRequestException('disciplinaId é obrigatório');

    await this.assertCanModifyNota(null, user, disciplinaId);

    const aluno = await this.findAlunoByMatricula(alunoId);
    const disciplina = await this.findDisciplinaById(disciplinaId);

    const nota = this.notaRepository.create({
      valor,
      tipoAvaliacao,
      data: new Date(data),
      observacao: observacao ?? undefined,
      aluno,
      disciplina,
    });

    return this.notaRepository.save(nota);
  }

  /**
   * Lista notas aplicando filtros e restrições por role.
   * filters: FilterNotaDto
   * user: req.user
   */
  async findAll(filters: FilterNotaDto | undefined, user: any): Promise<Nota[]> {
    const qb = this.notaRepository
      .createQueryBuilder('nota')
      .leftJoinAndSelect('nota.aluno', 'aluno')
      .leftJoinAndSelect('nota.disciplina', 'disciplina')
      .orderBy('nota.data', 'DESC');

    if (filters?.alunoId) {
      qb.andWhere('aluno.matricula_aluno = :alunoId', { alunoId: filters.alunoId });
    }

    if (filters?.disciplinaId) {
      qb.andWhere('disciplina.id_disciplina = :disciplinaId', { disciplinaId: filters.disciplinaId });
    }

    if (filters?.tipoAvaliacao) {
      qb.andWhere('nota.tipoAvaliacao = :tipoAvaliacao', { tipoAvaliacao: filters.tipoAvaliacao });
    }

    if (filters?.dataInicio) {
      qb.andWhere('nota.data >= :dataInicio', { dataInicio: filters.dataInicio });
    }

    if (filters?.dataFim) {
      qb.andWhere('nota.data <= :dataFim', { dataFim: filters.dataFim });
    }

    if (!user) throw new ForbiddenException('Usuário não autenticado');

    if (user.role === Role.COORDENACAO) {
      return qb.getMany();
    }

    if (user.role === Role.ALUNO) {
      if (!user.matricula_aluno) throw new ForbiddenException('Matrícula do aluno não encontrada no token');
      qb.andWhere('aluno.matricula_aluno = :matAluno', { matAluno: user.matricula_aluno });
      return qb.getMany();
    }

    if (user.role === Role.PROFESSOR) {
      const professor = await this.findProfessorByUsuarioId(user.id);
      if (!professor) throw new ForbiddenException('Professor não encontrado para o usuário autenticado');

      const turmas = await this.turmaRepository.find({
        where: { professor: { id_professor: professor.id_professor } as any },
        relations: ['disciplinas'],
      });
      const disciplinaIds = turmas.flatMap(t => (t.disciplinas || []).map(d => d.id_disciplina));
      if (disciplinaIds.length === 0) return [];
      qb.andWhere('disciplina.id_disciplina IN (:...ids)', { ids: disciplinaIds });
      return qb.getMany();
    }

    throw new ForbiddenException('Role não autorizada para listar notas');
  }

  /**
   * Busca uma nota por id_nota e valida leitura conforme user.
   */
  async findOne(id: string, user: any): Promise<Nota> {
    const nota = await this.notaRepository.findOne({
      where: { id_nota: id },
      relations: ['aluno', 'disciplina'],
    });
    if (!nota) throw new NotFoundException(`Nota com ID ${id} não encontrada`);

    await this.assertCanReadNota(nota, user);
    return nota;
  }

  /**
   * Atualiza uma nota. Professores podem alterar valor/tipo/data/observacao se autorizados.
   * Coordenação pode também trocar aluno/disciplina.
   */
  async update(id: string, updateNotaDto: UpdateNotaDto, user: any): Promise<Nota> {
    const nota = await this.notaRepository.findOne({
      where: { id_nota: id },
      relations: ['aluno', 'disciplina'],
    });
    if (!nota) throw new NotFoundException(`Nota com ID ${id} não encontrada`);

    await this.assertCanModifyNota(nota, user);

    if (updateNotaDto.valor !== undefined) nota.valor = updateNotaDto.valor;
    if (updateNotaDto.tipoAvaliacao !== undefined) nota.tipoAvaliacao = updateNotaDto.tipoAvaliacao;
    if (updateNotaDto.data !== undefined) nota.data = new Date(updateNotaDto.data);
    if (updateNotaDto.observacao !== undefined) nota.observacao = updateNotaDto.observacao;

    if (user.role === Role.COORDENACAO) {
      if (updateNotaDto.alunoId !== undefined && updateNotaDto.alunoId !== nota.aluno.matricula_aluno) {
        nota.aluno = await this.findAlunoByMatricula(updateNotaDto.alunoId);
      }
      if (updateNotaDto.disciplinaId !== undefined && updateNotaDto.disciplinaId !== nota.disciplina.id_disciplina) {
        nota.disciplina = await this.findDisciplinaById(updateNotaDto.disciplinaId);
      }
    }

    return this.notaRepository.save(nota);
  }

  /**
   * Remove nota por id_nota (valida autorização).
   */
  async remove(id: string, user: any): Promise<void> {
    const nota = await this.notaRepository.findOne({
      where: { id_nota: id },
      relations: ['aluno', 'disciplina'],
    });
    if (!nota) throw new NotFoundException(`Nota com ID ${id} não encontrada`);

    await this.assertCanModifyNota(nota, user);

    await this.notaRepository.remove(nota);
  }
}
