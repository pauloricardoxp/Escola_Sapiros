import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario, Role } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
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
