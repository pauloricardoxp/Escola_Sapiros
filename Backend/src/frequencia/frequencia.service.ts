import { Injectable,NotFoundException,BadRequestException,ForbiddenException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Frequencia } from './entities/frequencia.entity';
import { CreateFrequenciaDto } from './dto/create-frequencia.dto';
import { UpdateFrequenciaDto } from './dto/update-frequencia.dto';
import { FrequenciaFilterDto } from './dto/frequencia-filter.dto';
import { Aluno } from '../aluno/entities/aluno.entity';
import { Disciplina } from '../disciplina/entities/disciplina.entity';
import { Turma } from '../turma/entities/turma.entity';
import { Professor } from '../professor/entities/professor.entity';
import { Usuario, Role } from '../usuario/entities/usuario.entity';

@Injectable()
export class FrequenciaService {
  constructor(
    @InjectRepository(Frequencia)
    private readonly frequenciaRepository: Repository<Frequencia>,
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

  private parseDateOrThrow(dateStr?: string | Date): Date {
    if (!dateStr) throw new BadRequestException('Data inválida ou ausente');
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (Number.isNaN(d.getTime())) throw new BadRequestException('Data inválida');
    return d;
  }

  private async assertCanReadFrequencia(frequencia: Frequencia, user: any): Promise<void> {
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    if (user.role === Role.COORDENACAO) return;

    if (user.role === Role.PROFESSOR) {
      const professor = await this.findProfessorByUsuarioId(user.id);
      if (!professor) throw new ForbiddenException('Professor não encontrado para o usuário autenticado');
      const ok = await this.professorMinistraDisciplina(professor, frequencia.disciplina.id_disciplina);
      if (!ok) throw new ForbiddenException('Professor não autorizado para acessar esta frequência');
      return;
    }

    if (user.role === Role.ALUNO) {
      if (!frequencia.aluno) throw new NotFoundException('Frequência sem aluno vinculado');
      if (frequencia.aluno.matricula_aluno !== user.matricula_aluno) {
        throw new ForbiddenException('Aluno não autorizado a ver esta frequência');
      }
      return;
    }

    throw new ForbiddenException('Role não autorizada');
  }

  private async assertCanModifyFrequencia(frequencia: Frequencia | null, user: any, disciplinaIdForCreate?: string): Promise<void> {
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    if (user.role === Role.COORDENACAO) return;

    if (user.role === Role.PROFESSOR) {
      const professor = await this.findProfessorByUsuarioId(user.id);
      if (!professor) throw new ForbiddenException('Professor não encontrado para o usuário autenticado');

      if (frequencia) {
        const ok = await this.professorMinistraDisciplina(professor, frequencia.disciplina.id_disciplina);
        if (!ok) throw new ForbiddenException('Professor não autorizado para modificar esta frequência');
        return;
      }

      if (!disciplinaIdForCreate) throw new BadRequestException('Disciplina é obrigatória para criação de frequência');
      const ministra = await this.professorMinistraDisciplina(professor, disciplinaIdForCreate);
      if (!ministra) throw new ForbiddenException('Professor não autorizado para criar frequência nesta disciplina');
      return;
    }

    throw new ForbiddenException('Apenas coordenação e professores podem modificar frequências');
  }

 
  /**
   * Cria uma frequência.
   * createFrequenciaDto deve conter:
   * - data (string ou Date)
   * - presente (boolean)
   * - observacao? (string)
   * - alunoId (matrícula do aluno)
   * - disciplinaId (UUID)
   * user: req.user (id, role, matricula_aluno quando aplicável)
   */
  async create(createFrequenciaDto: CreateFrequenciaDto, user: any): Promise<Frequencia> {
    const { data, presente, observacao, alunoId, disciplinaId } = createFrequenciaDto;

    if (!alunoId) throw new BadRequestException('alunoId (matrícula) é obrigatório');
    if (!disciplinaId) throw new BadRequestException('disciplinaId é obrigatório');

    await this.assertCanModifyFrequencia(null, user, disciplinaId);

    const aluno = await this.findAlunoByMatricula(alunoId);
    const disciplina = await this.findDisciplinaById(disciplinaId);

    const d = this.parseDateOrThrow(data);

    const frequencia = this.frequenciaRepository.create({
      data: d,
      presente: Boolean(presente),
      observacao: observacao ?? undefined,
      aluno,
      disciplina,
    });

    return this.frequenciaRepository.save(frequencia);
  }

  /**
   * Lista frequências com filtros e restrições por role.
   * filters: FrequenciaFilterDto (alunoId, disciplinaId, dataInicio, dataFim, presente)
   * user: req.user
   */
  async findAll(filters: FrequenciaFilterDto | undefined, user: any): Promise<Frequencia[]> {
    const qb = this.frequenciaRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.aluno', 'aluno')
      .leftJoinAndSelect('f.disciplina', 'disciplina')
      .orderBy('f.data', 'DESC');

    if (filters?.alunoId) {
      qb.andWhere('aluno.matricula_aluno = :alunoId', { alunoId: filters.alunoId });
    }

    if (filters?.disciplinaId) {
      qb.andWhere('disciplina.id_disciplina = :disciplinaId', { disciplinaId: filters.disciplinaId });
    }

    if (filters?.presente !== undefined) {
      qb.andWhere('f.presente = :presente', { presente: filters.presente });
    }

    if (filters?.dataInicio) {
      const dInicio = this.parseDateOrThrow(filters.dataInicio);
      qb.andWhere('f.data >= :dataInicio', { dataInicio: dInicio.toISOString().slice(0, 10) });
    }

    if (filters?.dataFim) {
      const dFim = this.parseDateOrThrow(filters.dataFim);
      qb.andWhere('f.data <= :dataFim', { dataFim: dFim.toISOString().slice(0, 10) });
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

    throw new ForbiddenException('Role não autorizada para listar frequências');
  }

  /**
   * Resumo por aluno e disciplina: total de registros, presenças, faltas e percentual.
   * Aplica validação de acesso (aluno só para si; professor apenas para disciplinas que ministra; coordenação tudo).
   */
  async resumoPorAlunoEDisciplina(
    alunoId: string,
    disciplinaId: string,
    dataInicio?: string,
    dataFim?: string,
    user?: any,
  ): Promise<{ total: number; presencas: number; faltas: number; percentualPresenca: number }> {
    if (!alunoId) throw new BadRequestException('alunoId (matrícula) é obrigatório');
    if (!disciplinaId) throw new BadRequestException('disciplinaId é obrigatório');

    const aluno = await this.findAlunoByMatricula(alunoId);
    const disciplina = await this.findDisciplinaById(disciplinaId);

    // autorização: montar um objeto Frequencia mínimo para checar leitura
    const dummyFreq = new Frequencia();
    dummyFreq.aluno = aluno;
    dummyFreq.disciplina = disciplina;

    await this.assertCanReadFrequencia(dummyFreq, user);

    const qb = this.frequenciaRepository
      .createQueryBuilder('f')
      .select([
        'COUNT(f.id_frequencia) as total',
        'SUM(CASE WHEN f.presente = true THEN 1 ELSE 0 END) as presencas',
      ])
      .where('f.aluno_id = :mat', { mat: aluno.matricula_aluno })
      .andWhere('f.disciplina_id = :did', { did: disciplina.id_disciplina });

    if (dataInicio) {
      const dInicio = this.parseDateOrThrow(dataInicio);
      qb.andWhere('f.data >= :dataInicio', { dataInicio: dInicio.toISOString().slice(0, 10) });
    }
    if (dataFim) {
      const dFim = this.parseDateOrThrow(dataFim);
      qb.andWhere('f.data <= :dataFim', { dataFim: dFim.toISOString().slice(0, 10) });
    }

    const raw = await qb.getRawOne();
    const total = Number(raw?.total ?? 0);
    const presencas = Number(raw?.presencas ?? 0);
    const faltas = total - presencas;
    const percentualPresenca = total === 0 ? 0 : Math.round((presencas / total) * 10000) / 100; // 2 casas decimais

    return { total, presencas, faltas, percentualPresenca };
  }

  /**
   * Busca uma frequência por id_frequencia e valida leitura conforme user.
   */
  async findOne(id: string, user: any): Promise<Frequencia> {
    const frequencia = await this.frequenciaRepository.findOne({
      where: { id_frequencia: id },
      relations: ['aluno', 'disciplina'],
    });
    if (!frequencia) throw new NotFoundException(`Frequência com ID ${id} não encontrada`);

    await this.assertCanReadFrequencia(frequencia, user);
    return frequencia;
  }

  /**
   * Atualiza uma frequência. Professores e coordenação podem alterar (professor apenas se ministra a disciplina).
   */
  async update(id: string, updateFrequenciaDto: UpdateFrequenciaDto, user: any): Promise<Frequencia> {
    const frequencia = await this.frequenciaRepository.findOne({
      where: { id_frequencia: id },
      relations: ['aluno', 'disciplina'],
    });
    if (!frequencia) throw new NotFoundException(`Frequência com ID ${id} não encontrada`);

    await this.assertCanModifyFrequencia(frequencia, user);

    if (updateFrequenciaDto.data !== undefined) {
      frequencia.data = this.parseDateOrThrow(updateFrequenciaDto.data);
    }
    if (updateFrequenciaDto.presente !== undefined) {
      frequencia.presente = Boolean(updateFrequenciaDto.presente);
    }
    if (updateFrequenciaDto.observacao !== undefined) {
      frequencia.observacao = updateFrequenciaDto.observacao;
    }

    // trocar aluno/disciplina apenas para coordenação
    if (user?.role === Role.COORDENACAO) {
      if (updateFrequenciaDto.alunoId !== undefined && updateFrequenciaDto.alunoId !== frequencia.aluno.matricula_aluno) {
        frequencia.aluno = await this.findAlunoByMatricula(updateFrequenciaDto.alunoId);
      }
      if (updateFrequenciaDto.disciplinaId !== undefined && updateFrequenciaDto.disciplinaId !== frequencia.disciplina.id_disciplina) {
        frequencia.disciplina = await this.findDisciplinaById(updateFrequenciaDto.disciplinaId);
      }
    }

    return this.frequenciaRepository.save(frequencia);
  }

  /**
   * Remove uma frequência (valida autorização).
   */
  async remove(id: string, user: any): Promise<void> {
    const frequencia = await this.frequenciaRepository.findOne({
      where: { id_frequencia: id },
      relations: ['aluno', 'disciplina'],
    });
    if (!frequencia) throw new NotFoundException(`Frequência com ID ${id} não encontrada`);

    await this.assertCanModifyFrequencia(frequencia, user);

    await this.frequenciaRepository.remove(frequencia);
  }
}
