import { Body,Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query,Req,UseGuards,UsePipes,ValidationPipe,} from '@nestjs/common';
import type { Request } from 'express';
import { FrequenciaService } from './frequencia.service';
import { CreateFrequenciaDto } from './dto/create-frequencia.dto';
import { UpdateFrequenciaDto } from './dto/update-frequencia.dto';
import { FrequenciaFilterDto } from './dto/frequencia-filter.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role, Usuario } from '../usuario/entities/usuario.entity';
import { Frequencia } from './entities/frequencia.entity';

/**
 * Tipo local que estende Request para incluir `user` (populado pelo JwtAuthGuard).
 * Ajuste `Usuario` se o shape do token for diferente (por exemplo, payload parcial).
 */
type AuthRequest = Request & { user?: Usuario | any };

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('frequencias')
export class FrequenciaController {
  constructor(private readonly frequenciaService: FrequenciaService) {}

  // Criar frequência: coordenação e professores
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() createFrequenciaDto: CreateFrequenciaDto,
    @Req() req: AuthRequest,
  ): Promise<Frequencia> {
    return await this.frequenciaService.create(createFrequenciaDto, req.user);
  }

  // Listar frequências: coordenação, professores e alunos (service filtra por role)
  @Roles(Role.COORDENACAO, Role.PROFESSOR, Role.ALUNO)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true, skipMissingProperties: true }))
  async findAll(
    @Query() filters: FrequenciaFilterDto,
    @Req() req: AuthRequest,
  ): Promise<Frequencia[]> {
    return await this.frequenciaService.findAll(filters, req.user);
  }

  // Resumo por aluno e disciplina: coordenação, professores e alunos (service valida)
  @Roles(Role.COORDENACAO, Role.PROFESSOR, Role.ALUNO)
  @Get('resumo')
  async resumo(
    @Query('alunoId') alunoId: string,
    @Query('disciplinaId', ParseUUIDPipe) disciplinaId: string,
    @Query('dataInicio') dataInicio: string | undefined,
    @Query('dataFim') dataFim: string | undefined,
    @Req() req: AuthRequest,
  ) {
    return await this.frequenciaService.resumoPorAlunoEDisciplina(
      alunoId,
      disciplinaId,
      dataInicio,
      dataFim,
      req.user,
    );
  }

  // Buscar por id: coordenação, professores e aluno (service valida acesso)
  @Roles(Role.COORDENACAO, Role.PROFESSOR, Role.ALUNO)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<Frequencia> {
    return await this.frequenciaService.findOne(id, req.user);
  }

  // Atualizar frequência: coordenação e professores
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFrequenciaDto: UpdateFrequenciaDto,
    @Req() req: AuthRequest,
  ): Promise<Frequencia> {
    return await this.frequenciaService.update(id, updateFrequenciaDto, req.user);
  }

  // Remover frequência: coordenação e professores
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    return await this.frequenciaService.remove(id, req.user);
  }
}
