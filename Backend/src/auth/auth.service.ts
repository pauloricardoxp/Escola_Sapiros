import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';
import { Role, Usuario } from '../usuario/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno } from '../aluno/entities/aluno.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
  ) {}

  async login(dto: LoginDto) {
    let usuario: Usuario | null = null;

    if (dto.role === Role.ALUNO) {
      if (!dto.matricula) {
        throw new UnauthorizedException('Matrícula é obrigatória para alunos');
      }

      const aluno = await this.alunoRepository.findOne({
        where: { matricula_aluno: dto.matricula },
        relations: ['usuario'],
      });

      if (!aluno) {
        throw new UnauthorizedException('Matrícula não encontrada');
      }

      usuario = aluno.usuario;
    } else {
      if (!dto.identificador) {
        throw new UnauthorizedException('Identificador é obrigatório');
      }

      usuario = await this.usuarioService.findByCpfOrEmail(dto.identificador);

      if (!usuario) {
        throw new UnauthorizedException('Usuário não encontrado');
      }
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaPadrao = 'Sapiros@123';
    const isSenhaPadrao = await bcrypt.compare(senhaPadrao, usuario.senha);
    if (isSenhaPadrao) {
      throw new UnauthorizedException(
        'Senha temporária detectada. Você deve alterá-la antes de acessar o sistema.',
      );
    }

    if (usuario.senhaExpiraEm && new Date() > new Date(usuario.senhaExpiraEm)) {
      throw new UnauthorizedException('A senha expirou. Por favor, redefina sua senha.');
    }

    const payload = {
      sub: usuario.id,
      role: usuario.role,
      senhaExpiraEm: usuario.senhaExpiraEm,
    };

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        role: usuario.role,
      },
      token: this.jwtService.sign(payload),
    };
  }
}
