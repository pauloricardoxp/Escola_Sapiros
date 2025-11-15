import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('professores')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  // Criar: coordenacao
  @Roles('coordenacao')
  @Post()
  create(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorService.create(createProfessorDto);
  }

  // Listar: coordenacao, professores
  @Roles('coordenacao', 'professores')
  @Get()
  findAll() {
    return this.professorService.findAll();
  }

  // Ver: coordenacao, professores
  @Roles('coordenacao', 'professores')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professorService.findOne(+id);
  }

  // Atualizar: coordenacao
  @Roles('coordenacao')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfessorDto: UpdateProfessorDto) {
    return this.professorService.update(+id, updateProfessorDto);
  }

  // Deletar: coordenacao
  @Roles('coordenacao')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professorService.remove(+id);
  }
}
