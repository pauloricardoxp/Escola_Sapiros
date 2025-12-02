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
    if (!usuario)
      throw new UnauthorizedException('Credenciais inválidas');

    // Verifica se a senha informada está correta
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida)
      throw new UnauthorizedException('Credenciais inválidas');

    // Impedir login com senha Padrão
    const senhaPadrao = 'Sapiros@123';
    const isSenhaPadrao = await bcrypt.compare(senhaPadrao, usuario.senha);

    if (isSenhaPadrao) {
      throw new UnauthorizedException(
        'Senha temporária detectada. Você deve alterá-la antes de acessar o sistema.',
      );
    }

    // Verifica se a senha expirou
    if (usuario.senhaExpiraEm && new Date() > new Date(usuario.senhaExpiraEm)) {
      throw new UnauthorizedException(
        'A senha expirou. Por favor, redefina sua senha.',
      );
    }

    // Inserir data da expiração no payload
    const payload = {
      sub: usuario.id,
      role: usuario.role,
      senhaExpiraEm: usuario.senhaExpiraEm,
    };

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
