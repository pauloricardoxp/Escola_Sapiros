import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SenhaExpiradaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Esse usuário vem do JwtAuthGuard (depois da validação do token)
    const usuario = request.user;

    if (!usuario) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const dataAtualizacao = new Date(usuario.senhaAtualizadaEm);
    const hoje = new Date();

    const diferencaDias =
      (hoje.getTime() - dataAtualizacao.getTime()) /
      (1000 * 60 * 60 * 24);

    const limiteDias = 180;

    if (diferencaDias > limiteDias) {
      throw new UnauthorizedException(
        'Senha expirada. Atualize sua senha para continuar.',
      );
    }

    return true;
  }
}
