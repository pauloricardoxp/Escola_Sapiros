import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario, Role } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

@Controller('usuarios')
@UseGuards(AuthGuard('jwt'), RolesGuard) 
@Roles('secretaria')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get('role/:role')
  findByRole(@Param('role') role: Role): Promise<Usuario[]> {
    return this.usuarioService.findByRole(role);
  }

  @Post()
  create(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(dto);
  }
}

