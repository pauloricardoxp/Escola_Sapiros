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
    return this.usuarioRepository.find();
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
    // Não expor a senha
    delete (salvo as any).senha;
    return salvo;
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    // Re-hash se veio nova senha
    if (dto.senha) {
      const salt = await bcrypt.genSalt();
      dto.senha = await bcrypt.hash(dto.senha, salt);
    }

    Object.assign(usuario, dto);
    const salvo = await this.usuarioRepository.save(usuario);
    delete (salvo as any).senha;
    return salvo;
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
