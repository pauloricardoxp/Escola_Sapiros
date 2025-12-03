import {Body, Controller, Delete, Get, Param, ParseUUIDPipe,Patch, Post, Req, UseGuards, UsePipes,ValidationPipe,} from '@nestjs/common';
import type { Request } from 'express';
import { DisciplinaService } from './disciplina.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role, Usuario } from '../usuario/entities/usuario.entity';
import { Disciplina } from './entities/disciplina.entity';

type AuthRequest = Request & { user?: Usuario | any };

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disciplinas')
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  // Criar disciplina: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() createDisciplinaDto: CreateDisciplinaDto,
    @Req() req: AuthRequest,
  ): Promise<Disciplina> {
    return await this.disciplinaService.create(createDisciplinaDto, req.user);
  }

  // Listar disciplinas: coordenação, professores e alunos
  @Roles(Role.COORDENACAO, Role.PROFESSOR, Role.ALUNO)
  @Get()
  async findAll(@Req() req: AuthRequest): Promise<Disciplina[]> {
    return await this.disciplinaService.findAll(req.user);
  }

  // Buscar por id: coordenação, professores e alunos
  @Roles(Role.COORDENACAO, Role.PROFESSOR, Role.ALUNO)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<Disciplina> {
    return await this.disciplinaService.findOne(id, req.user);
  }

  // Atualizar disciplina: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDisciplinaDto: UpdateDisciplinaDto,
    @Req() req: AuthRequest,
  ): Promise<Disciplina> {
    return await this.disciplinaService.update(id, updateDisciplinaDto, req.user);
  }

  // Remover disciplina: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    return await this.disciplinaService.remove(id, req.user);
  }
}
