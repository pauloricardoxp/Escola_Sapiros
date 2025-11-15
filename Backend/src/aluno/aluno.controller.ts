import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { MatriculaParamDto } from './dto/matricula-param.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('alunos')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @Roles('coordenacao')
  @Post()
  create(@Body() createAlunoDto: CreateAlunoDto) {
    return this.alunoService.create(createAlunoDto);
  }

  @Roles('coordenacao', 'professores')
  @Get()
  findAll() {
    return this.alunoService.findAll();
  }

  @Roles('coordenacao', 'professores')
  @Get(':matricula')
  findOne(@Param(new ValidationPipe({ transform: true })) params: MatriculaParamDto) {
    return this.alunoService.findOne(params.matricula);
  }

  @Roles('coordenacao')
  @Patch(':matricula')
  update(@Param(new ValidationPipe({ transform: true })) params: MatriculaParamDto, @Body() updateAlunoDto: UpdateAlunoDto) {
    return this.alunoService.update(params.matricula, updateAlunoDto);
  }

  @Roles('coordenacao')
  @Delete(':matricula')
  remove(@Param(new ValidationPipe({ transform: true })) params: MatriculaParamDto) {
    return this.alunoService.remove(params.matricula);
  }
}