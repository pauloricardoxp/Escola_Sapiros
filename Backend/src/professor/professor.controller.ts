import {Controller,Get, Post, Body,Patch, Param, Delete,UseGuards, UsePipes,ValidationPipe, ParseUUIDPipe,} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../usuario/entities/usuario.entity';
import { Professor } from './entities/professor.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('professores')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  // Criar: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createProfessorDto: CreateProfessorDto): Promise<Professor> {
    return await this.professorService.create(createProfessorDto);
  }

  // Listar: coordenação e professores
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Get()
  async findAll(): Promise<Professor[]> {
    return await this.professorService.findAll();
  }

  // Ver: coordenação e professores
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Professor> {
    return await this.professorService.findOne(id);
  }

  // Atualizar: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ): Promise<Professor> {
    return await this.professorService.update(id, updateProfessorDto);
  }

  // Deletar: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.professorService.remove(id);
  }
}
