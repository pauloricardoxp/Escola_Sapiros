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
    const usuario = await this.usuarioService.findByCpfOrEmail(identificador);
    if (!usuario) throw new UnauthorizedException('Credenciais inválidas');

    // Ao buscar direto do repository, a senha vem; não retorne a senha ao cliente
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new UnauthorizedException('Credenciais inválidas');

    const payload = { sub: usuario.id, role: usuario.role };
    const token = this.jwtService.sign(payload);

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        role: usuario.role,
      },
      token,
    };
  }
}
