import { Body, Controller,Delete, Get,Param, ParseUUIDPipe,Patch,Post,Query, Req,UseGuards,UsePipes, ValidationPipe,} from '@nestjs/common';
import type { Request } from 'express';
import { AvisosService } from './avisos.service';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateAvisoDto } from './dto/update-aviso.dto';
import { FilterAvisoDto } from './dto/filter-aviso.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role, Usuario } from '../usuario/entities/usuario.entity';
import { Aviso } from './entities/aviso.entity';

type AuthRequest = Request & { user?: Usuario | any };

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('avisos')
export class AvisosController {
  constructor(private readonly avisosService: AvisosService) {}

  // Criar aviso: coordenação e professores
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createAvisoDto: CreateAvisoDto, @Req() req: AuthRequest): Promise<Aviso> {
    return await this.avisosService.create(createAvisoDto, req.user);
  }

  // Listar avisos: todos autenticados (coordenação, professor, aluno)
  @Roles(Role.COORDENACAO, Role.PROFESSOR, Role.ALUNO)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, skipMissingProperties: true }))
  async findAll(@Query() filters: FilterAvisoDto, @Req() req: AuthRequest): Promise<Aviso[]> {
    return await this.avisosService.findAll(filters, req.user);
  }

  // Buscar por id: todos autenticados (service valida escopo para avisos tipo TURMA/INDIVIDUAL)
  @Roles(Role.COORDENACAO, Role.PROFESSOR, Role.ALUNO)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthRequest): Promise<Aviso> {
    return await this.avisosService.findOne(id, req.user);
  }

  // Atualizar aviso: coordenação e professores (service deve validar autoria/escopo)
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAvisoDto: UpdateAvisoDto,
    @Req() req: AuthRequest,
  ): Promise<Aviso> {
    return await this.avisosService.update(id, updateAvisoDto, req.user);
  }

  // Remover aviso: coordenação e professores (service valida autorização)
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthRequest): Promise<void> {
    return await this.avisosService.remove(id, req.user);
  }
}
