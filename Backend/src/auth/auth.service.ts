import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(identificador: string, senha: string) {
    // Busca usuário por CPF ou Email
    const usuario = await this.usuarioService.findByCpfOrEmail(identificador);
    if (!usuario) throw new UnauthorizedException('Credenciais inválidas');

    // Valida senha com bcrypt
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new UnauthorizedException('Credenciais inválidas');

    // Payload do JWT
    const payload = { sub: usuario.id, role: usuario.role };

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
