import {Injectable,NotFoundException,BadRequestException, ForbiddenException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coordenacao } from './entities/coordenacao.entity';
import { CreateCoordenacaoDto } from './dto/create-coordenacao.dto';
import { UpdateCoordenacaoDto } from './dto/update-coordenacao.dto';
import { Usuario, Role } from '../usuario/entities/usuario.entity';

@Injectable()
export class CoordenacaoService {
  constructor(
    @InjectRepository(Coordenacao)
    private readonly coordenacaoRepository: Repository<Coordenacao>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  

  private async findUsuarioOrFail(id: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    return usuario;
  }

  private assertIsCoordenacao(user: any) {
    if (!user) throw new ForbiddenException('Usuário não autenticado');
    if (user.role !== Role.COORDENACAO) {
      throw new ForbiddenException('Apenas usuários com role COORDENACAO podem executar esta ação');
    }
  }

  

  /**
   * Cria um registro de coordenação.
   * createDto.usuarioId deve ser UUID do usuário existente.
   * user é o req.user passado pelo controller; usamos any para evitar erro de tipagem do Request.
   */
  async create(createDto: CreateCoordenacaoDto, user: any): Promise<Coordenacao> {
    this.assertIsCoordenacao(user);

    const usuario = await this.findUsuarioOrFail(createDto.usuarioId);

    // opcional: checar se já existe coordenação para esse usuário
    const exists = await this.coordenacaoRepository.findOne({
      where: { usuario: { id: usuario.id } as any },
    });
    if (exists) throw new BadRequestException('Já existe um registro de coordenação para este usuário');

    const coord = this.coordenacaoRepository.create({
      funcao: createDto.funcao,
      usuario,
    });

    return this.coordenacaoRepository.save(coord);
  }

  /**
   * Lista todos os registros de coordenação.
   * Apenas coordenação pode listar aqui (conforme controller).
   */
  async findAll(user: any): Promise<Coordenacao[]> {
    this.assertIsCoordenacao(user);
    return this.coordenacaoRepository.find({ relations: ['usuario'] });
  }

  /**
   * Busca um registro por id_coordenacao.
   * Apenas coordenação pode acessar.
   */
  async findOne(id: string, user: any): Promise<Coordenacao> {
    this.assertIsCoordenacao(user);
    const coord = await this.coordenacaoRepository.findOne({
      where: { id_coordenacao: id },
      relations: ['usuario'],
    });
    if (!coord) throw new NotFoundException(`Coordenacao com ID ${id} não encontrada`);
    return coord;
  }

  /**
   * Atualiza um registro de coordenação.
   * Apenas coordenação pode atualizar.
   */
  async update(id: string, updateDto: UpdateCoordenacaoDto, user: any): Promise<Coordenacao> {
    this.assertIsCoordenacao(user);

    const coord = await this.coordenacaoRepository.findOne({
      where: { id_coordenacao: id },
      relations: ['usuario'],
    });
    if (!coord) throw new NotFoundException(`Coordenacao com ID ${id} não encontrada`);

    if (updateDto.funcao !== undefined) coord.funcao = updateDto.funcao;

    if (updateDto.usuarioId !== undefined && updateDto.usuarioId !== coord.usuario.id) {
      const usuario = await this.findUsuarioOrFail(updateDto.usuarioId);
      coord.usuario = usuario;
    }

    return this.coordenacaoRepository.save(coord);
  }

  /**
   * Remove um registro de coordenação.
   * Apenas coordenação pode remover.
   */
  async remove(id: string, user: any): Promise<void> {
    this.assertIsCoordenacao(user);

    const coord = await this.coordenacaoRepository.findOne({
      where: { id_coordenacao: id },
      relations: ['usuario'],
    });
    if (!coord) throw new NotFoundException(`Coordenacao com ID ${id} não encontrada`);

    await this.coordenacaoRepository.remove(coord);
  }
}
