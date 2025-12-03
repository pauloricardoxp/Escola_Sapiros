import {Injectable,NotFoundException,BadRequestException,ForbiddenException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aviso, TipoAviso } from './entities/aviso.entity';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateAvisoDto } from './dto/update-aviso.dto';
import { FilterAvisoDto } from './dto/filter-aviso.dto';
import { Usuario, Role } from '../usuario/entities/usuario.entity';
import { Turma } from '../turma/entities/turma.entity';

@Injectable()
export class AvisosService {
  constructor(
    @InjectRepository(Aviso)
    private readonly avisoRepository: Repository<Aviso>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Turma)
    private readonly turmaRepository: Repository<Turma>,
  ) {}

  // --------------------
  // Helpers
  // --------------------

  private async findUsuarioOrFail(id: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    return usuario;
  }

  private async findTurmaOrFail(id: string) {
    const turma = await this.turmaRepository.findOne({ where: { id_turma: id } });
    if (!turma) throw new NotFoundException(`Turma com ID ${id} não encontrada`);
    return turma;
  }

  private parseDateOrThrow(date?: string | Date): Date {
    if (!date) throw new BadRequestException('Data inválida ou ausente');
    const d = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) throw new BadRequestException('Data inválida');
    return d;
  }

  /**
   * Verifica se o usuário pode criar/editar/remover o aviso.
   * - COORDENACAO: sempre pode
   * - PROFESSOR: pode criar/editar/remover seus próprios avisos (autoria)
   * - outros: proibido
   */
  private assertCanCreateOrModify(user: any, aviso?: Aviso): void {
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    if (user.role === Role.COORDENACAO) return;

    if (user.role === Role.PROFESSOR) {
      if (!aviso) return; // professor pode criar (autor será o próprio user)
      // para editar/remover, só o autor pode
      if (!aviso.usuario || aviso.usuario.id !== user.id) {
        throw new ForbiddenException('Professor não autorizado para modificar este aviso');
      }
      return;
    }

    throw new ForbiddenException('Apenas coordenação e professores podem criar/editar/remover avisos');
  }

  /**
   * Verifica se o usuário pode ler o aviso.
   * Regras aplicadas:
   * - GERAL: qualquer usuário autenticado
   * - TURMA: coordenação; professor que ministra a turma; alunos da turma (assumimos checagem externa)
   * - INDIVIDUAL: apenas coordenação e autor (ajuste se houver campo destinatário)
   */
  private async assertCanRead(aviso: Aviso, user: any): Promise<void> {
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    if (aviso.tipo === TipoAviso.GERAL) return;

    if (aviso.tipo === TipoAviso.INDIVIDUAL) {
      if (user.role === Role.COORDENACAO) return;
      if (aviso.usuario && aviso.usuario.id === user.id) return; // autor pode ver
      // Se você tiver um campo destinatário (ex: destinatarioUsuario), cheque aqui
      throw new ForbiddenException('Aviso individual apenas para destinatário ou coordenação');
    }

    if (aviso.tipo === TipoAviso.TURMA) {
      if (user.role === Role.COORDENACAO) return;
      // professor: checar se ministra a turma
      if (user.role === Role.PROFESSOR) {
        const turmas = await this.turmaRepository.find({
          where: { professor: { usuario: { id: user.id } as any } as any },
        });
        if (turmas.some(t => t.id_turma === aviso.turma?.id_turma)) return;
      }
      // aluno: idealmente checar vínculo aluno <-> turma; aqui permitimos leitura e recomendamos validar vínculo real
      if (user.role === Role.ALUNO) return;
      throw new ForbiddenException('Usuário não autorizado para ver este aviso de turma');
    }
  }

  // --------------------
  // CRUD
  // --------------------

  /**
   * Cria um aviso.
   * - Se user.role === COORDENACAO e createDto.usuarioId for fornecido, usa esse usuário como autor.
   * - Caso contrário, usa o usuário autenticado (req.user.id) como autor.
   */
  async create(createDto: CreateAvisoDto, user: any): Promise<Aviso> {
    this.assertCanCreateOrModify(user);

    const { titulo, conteudo, tipo = TipoAviso.GERAL, dataPublicacao, dataExpiracao, usuarioId, turmaId } = createDto;

    if (!titulo || !conteudo) throw new BadRequestException('titulo e conteudo são obrigatórios');

    // autor: coordenação pode especificar outro usuarioId; professores usam o próprio token
    let autorId: string = user.id.toString();
    if (user.role === Role.COORDENACAO && usuarioId !== undefined && usuarioId !== null) {
      autorId = usuarioId.toString();
    }

    const autor = await this.findUsuarioOrFail(autorId);

    let turma: Turma | null = null;
    if (tipo === TipoAviso.TURMA) {
      if (!turmaId) throw new BadRequestException('turmaId é obrigatório para avisos do tipo TURMA');
      turma = await this.findTurmaOrFail(turmaId);
    }

    const dp = this.parseDateOrThrow(dataPublicacao);
    const de = dataExpiracao ? this.parseDateOrThrow(dataExpiracao) : null;
    if (de && de < dp) throw new BadRequestException('dataExpiracao não pode ser anterior à dataPublicacao');

    const aviso = this.avisoRepository.create({
      titulo,
      conteudo,
      tipo,
      dataPublicacao: dp,
      dataExpiracao: de !== null ? de : undefined,
      usuario: autor,
      turma: tipo === TipoAviso.TURMA ? turma : undefined,
    });

    return this.avisoRepository.save(aviso);
  }

  /**
   * Lista avisos aplicando filtros e visibilidade por usuário.
   * Retorna apenas avisos que o usuário pode ver.
   */
  async findAll(filters: FilterAvisoDto | undefined, user: any): Promise<Aviso[]> {
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    const qb = this.avisoRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.usuario', 'usuario')
      .leftJoinAndSelect('a.turma', 'turma')
      .orderBy('a.dataPublicacao', 'DESC');

    if (filters?.tipo) qb.andWhere('a.tipo = :tipo', { tipo: filters.tipo });
    if (filters?.usuarioId !== undefined && filters.usuarioId !== null) qb.andWhere('usuario.id = :uid', { uid: filters.usuarioId });
    if (filters?.turmaId) qb.andWhere('turma.id_turma = :tid', { tid: filters.turmaId });
    if (filters?.termo) qb.andWhere('(a.titulo ILIKE :t OR a.conteudo ILIKE :t)', { t: `%${filters.termo}%` });

    if (filters?.dataInicio) {
      const dInicio = this.parseDateOrThrow(filters.dataInicio);
      qb.andWhere('a.dataPublicacao >= :dInicio', { dInicio: dInicio.toISOString() });
    }
    if (filters?.dataFim) {
      const dFim = this.parseDateOrThrow(filters.dataFim);
      qb.andWhere('a.dataPublicacao <= :dFim', { dFim: dFim.toISOString() });
    }

    const all = await qb.getMany();

    // aplicar checagem de visibilidade por aviso
    const visibles: Aviso[] = [];
    for (const a of all) {
      try {
        await this.assertCanRead(a, user);
        visibles.push(a);
      } catch {
        // ignorar avisos não visíveis
      }
    }

    return visibles;
  }

  /**
   * Busca um aviso por id e valida visibilidade.
   */
  async findOne(id: string, user: any): Promise<Aviso> {
    const aviso = await this.avisoRepository.findOne({
      where: { id },
      relations: ['usuario', 'turma'],
    });
    if (!aviso) throw new NotFoundException(`Aviso com ID ${id} não encontrado`);

    await this.assertCanRead(aviso, user);
    return aviso;
  }

  /**
   * Atualiza um aviso.
   * - COORDENACAO pode alterar qualquer aviso.
   * - PROFESSOR só pode alterar avisos que ele mesmo criou.
   */
  async update(id: string, updateDto: UpdateAvisoDto, user: any): Promise<Aviso> {
    const aviso = await this.avisoRepository.findOne({
      where: { id },
      relations: ['usuario', 'turma'],
    });
    if (!aviso) throw new NotFoundException(`Aviso com ID ${id} não encontrado`);

    this.assertCanCreateOrModify(user, aviso);

    if (updateDto.titulo !== undefined) aviso.titulo = updateDto.titulo;
    if (updateDto.conteudo !== undefined) aviso.conteudo = updateDto.conteudo;
    if (updateDto.tipo !== undefined) aviso.tipo = updateDto.tipo;
    if (updateDto.dataPublicacao !== undefined) aviso.dataPublicacao = this.parseDateOrThrow(updateDto.dataPublicacao);
    if (updateDto.dataExpiracao !== undefined) aviso.dataExpiracao = updateDto.dataExpiracao ? this.parseDateOrThrow(updateDto.dataExpiracao) : undefined;

    if (updateDto.turmaId !== undefined) {
      if (updateDto.turmaId === null) {
        aviso.turma = null;
      } else {
        aviso.turma = await this.findTurmaOrFail(updateDto.turmaId);
      }
    }

    // se COORDENACAO quiser trocar o autor (se DTO permitir), trate aqui:
    if (user.role === Role.COORDENACAO && (updateDto as any).usuarioId !== undefined) {
      aviso.usuario = await this.findUsuarioOrFail((updateDto as any).usuarioId);
    }

    return this.avisoRepository.save(aviso);
  }

  /**
   * Remove um aviso.
   * - COORDENACAO pode remover qualquer aviso.
   * - PROFESSOR só pode remover seus próprios avisos.
   */
  async remove(id: string, user: any): Promise<void> {
    const aviso = await this.avisoRepository.findOne({
      where: { id },
      relations: ['usuario', 'turma'],
    });
    if (!aviso) throw new NotFoundException(`Aviso com ID ${id} não encontrado`);

    this.assertCanCreateOrModify(user, aviso);

    await this.avisoRepository.remove(aviso);
  }
}
