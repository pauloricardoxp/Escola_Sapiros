import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coordenacao } from './entities/coordenacao.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateCoordenacaoDto } from './dto/create-coordenacao.dto';
import { UpdateCoordenacaoDto } from './dto/update-coordenacao.dto';

@Injectable()
export class CoordenacaoService {
  constructor(
    @InjectRepository(Coordenacao)
    private readonly coordenacaoRepository: Repository<Coordenacao>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createCoordenacaoDto: CreateCoordenacaoDto): Promise<Coordenacao> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: Number(createCoordenacaoDto.usuarioId) },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const coordenacao = this.coordenacaoRepository.create({
      email_coordenacao: createCoordenacaoDto.email,
      telefone_coordenacao: createCoordenacaoDto.telefone,
      funcao: createCoordenacaoDto.funcao,
      usuario,
    });
    return this.coordenacaoRepository.save(coordenacao);
  }

  async findAll(): Promise<Coordenacao[]> {
    return this.coordenacaoRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Coordenacao> {
    const coordenacao = await this.coordenacaoRepository.findOne({
      where: { id_coordenacao: id },
      relations: ['usuario'],
    });
    if (!coordenacao) throw new NotFoundException('Coordenação não encontrada');
    return coordenacao;
  }

  async update(id: number, updateCoordenacaoDto: UpdateCoordenacaoDto): Promise<Coordenacao> {
    const coordenacao = await this.findOne(id);
    Object.assign(coordenacao, {
      email_coordenacao: updateCoordenacaoDto.email ?? coordenacao.email_coordenacao,
      telefone_coordenacao: updateCoordenacaoDto.telefone ?? coordenacao.telefone_coordenacao,
      funcao: updateCoordenacaoDto.funcao ?? coordenacao.funcao,
    });
    return this.coordenacaoRepository.save(coordenacao);
  }

  async remove(id: number): Promise<void> {
    const coordenacao = await this.findOne(id);
    await this.coordenacaoRepository.remove(coordenacao);
  }
}
