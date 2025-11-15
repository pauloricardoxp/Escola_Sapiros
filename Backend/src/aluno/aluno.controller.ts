import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('alunos')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  // Criar: coordenacao
  @Roles('coordenacao')
  @Post()
  create(@Body() createAlunoDto: CreateAlunoDto) {
    return this.alunoService.create(createAlunoDto);
  }

  // Listar: coordenacao, professores
  @Roles('coordenacao', 'professores')
  @Get()
  findAll() {
    return this.alunoService.findAll();
  }

  // Ver: coordenacao, professores
  @Roles('coordenacao', 'professores')
  @Get(':matricula')
  findOne(@Param('matricula') matricula: string) {
    return this.alunoService.findOne(+matricula);
  }

  // Atualizar: coordenacao 
  @Roles('coordenacao')
  @Patch(':matricula')
  update(@Param('matricula') matricula: string, @Body() updateAlunoDto: UpdateAlunoDto) {
    return this.alunoService.update(+matricula, updateAlunoDto);
  }

  // Deletar: coordenacao
  @Roles('coordenacao')
  @Delete(':matricula')
  remove(@Param('matricula') matricula: string) {
    return this.alunoService.remove(+matricula);
  }
}
