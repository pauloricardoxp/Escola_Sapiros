import { Controller, Get, Param, Post, Body, UseGuards, Patch, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario, Role } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // Listar todos: permitir 'coordenacao' e 'professores' 
  @Roles('coordenacao', 'professores')
  @Get()
  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioService.findAll();
    // Não expor senha
    return usuarios.map(u => {
      const { senha, ...resto } = u;
      return resto as Usuario;
    });
  }

  // Buscar por role
  @Roles('coordenacao', 'professores')
  @Get('role/:role')
  async findByRole(@Param('role') role: Role): Promise<Usuario[]> {
    const usuarios = await this.usuarioService.findByRole(role);
    return usuarios.map(u => {
      const { senha, ...resto } = u;
      return resto as Usuario;
    });
  }

  // Buscar por id
  @Roles('coordenacao', 'professores')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Usuario> {
    const usuario = await this.usuarioService.findOne(+id);
    const { senha, ...resto } = usuario;
    return resto as Usuario;
  }

  // Criar: restringir a 'coordenacao'
  @Roles('coordenacao')
  @Post()
  create(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(dto);
  }

  // Atualizar: restringir a 'coordenacao'
  @Roles('coordenacao')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.update(+id, dto);
  }

  // Remover: restringir a 'coordenacao'
  @Roles('coordenacao')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usuarioService.remove(+id);
  }
}
