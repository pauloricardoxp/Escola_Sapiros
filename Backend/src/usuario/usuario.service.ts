import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, Role } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    // Nunca retorne a senha ao cliente (ideal: usar select para omitir)
    const usuarios = await this.usuarioRepository.find();
    return usuarios.map(u => {
      const { senha, ...resto } = u;
      return resto as Usuario;
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }

  async findByRole(role: Role): Promise<Usuario[]> {
    return this.usuarioRepository.find({ where: { role } });
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const salt = await bcrypt.genSalt();
    const senhaHash = await bcrypt.hash(dto.senha, salt);

    const novoUsuario = this.usuarioRepository.create({
      ...dto,
      senha: senhaHash,
    });

    const salvo = await this.usuarioRepository.save(novoUsuario);
    const { senha, ...resto } = salvo as any;
    return resto as Usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    if (dto.senha) {
      const salt = await bcrypt.genSalt();
      dto.senha = await bcrypt.hash(dto.senha, salt);
    }

    Object.assign(usuario, dto);
    const salvo = await this.usuarioRepository.save(usuario);
    const { senha, ...resto } = salvo as any;
    return resto as Usuario;
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }

  async findByCpfOrEmail(identifier: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: [{ cpf: identifier }, { email: identifier }],
    });
  }
}
