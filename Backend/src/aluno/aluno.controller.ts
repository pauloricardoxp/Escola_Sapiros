import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AlunoService } from './aluno.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role, Usuario } from '../usuario/entities/usuario.entity';
import { SenhaExpiradaGuard } from 'src/auth/senha-expirada/senha-expirada.guard';

type AuthRequest = Request & {
  user?: Usuario | { id: string; role: Role } | any;
};

@UseGuards(JwtAuthGuard, RolesGuard, SenhaExpiradaGuard)
@Controller('alunos')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  // Criar aluno: coordenação apenas
  @Roles(Role.COORDENACAO)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() createAlunoDto: CreateAlunoDto,
  ) {
    return await this.alunoService.create(createAlunoDto);
  }

  // Listar alunos: coordenação e professores
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Get()
  async findAll() {
    return await this.alunoService.findAll();
  }

  // Buscar aluno pela PK (id herdado de Usuario)
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    return await this.alunoService.findOne(id);
  }

  // Atualizar aluno
  @Roles(Role.COORDENACAO)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateAlunoDto: UpdateAlunoDto,
    @Req() req: AuthRequest,
  ) {
    return await this.alunoService.update(id, updateAlunoDto);
  }

  // Remover aluno
  @Roles(Role.COORDENACAO)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    return await this.alunoService.remove(id);
  }
}
