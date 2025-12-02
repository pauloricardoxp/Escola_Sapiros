import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async findAll(): Promise<Omit<Usuario, 'senha'>[]> {
    const usuarios = await this.usuarioRepository.find();
    return usuarios.map(({ senha, ...resto }) => resto);
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }

  async findByRole(role: Role): Promise<Omit<Usuario, 'senha'>[]> {
    const usuarios = await this.usuarioRepository.find({ where: { role } });
    return usuarios.map(({ senha, ...resto }) => resto);
  }

  async create(dto: CreateUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
    const senhaPadrao = 'Sapiros@123';

    if ((dto as any).senha === senhaPadrao) {
      throw new BadRequestException('A senha padrão não pode ser usada no cadastro.');
    }

    const salt = await bcrypt.genSalt();
    const senhaHash = await bcrypt.hash(senhaPadrao, salt);

    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + 180);

    const novoUsuario = this.usuarioRepository.create({
      ...dto,
      senha: senhaHash,
      senhaExpiraEm: dataExpiracao,
    });

    const salvo = await this.usuarioRepository.save(novoUsuario);
    const { senha, ...resto } = salvo;
    return resto;
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
    const usuario = await this.findOne(id);

    if (dto.senha) {
      const senhaPadrao = 'Sapiros@123';

      if (dto.senha === senhaPadrao) {
        throw new BadRequestException('A senha padrão não pode ser usada.');
      }

      const salt = await bcrypt.genSalt();
      dto.senha = await bcrypt.hash(dto.senha, salt);

      const dataExpiracao = new Date();
      dataExpiracao.setDate(dataExpiracao.getDate() + 180);
      dto.senhaExpiraEm = dataExpiracao;
    }

    Object.assign(usuario, dto);
    const salvo = await this.usuarioRepository.save(usuario);

    const { senha, ...resto } = salvo;
    return resto;
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }

  async findByCpfOrEmail(identifier: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: [{ cpf: identifier }, { email: identifier }],
    });
  }
}
