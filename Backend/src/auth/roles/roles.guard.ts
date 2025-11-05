import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidas = this.reflector.get<string[]>('roles', context.getHandler());
    if (!rolesPermitidas) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!rolesPermitidas.includes(user.role)) throw new ForbiddenException('Acesso negado');

    return true;
  }
}
