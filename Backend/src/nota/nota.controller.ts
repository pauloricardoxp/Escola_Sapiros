import { Body, Controller, Delete, Get, Param,ParseUUIDPipe,Patch,Post, Query,Req,UseGuards,UsePipes,ValidationPipe,} from '@nestjs/common';
import { Request } from 'express';
import { NotaService } from './nota.service';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { FilterNotaDto } from './dto/filter-nota.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../usuario/entities/usuario.entity';
import { Nota } from './entities/nota.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notas')
export class NotaController {
  constructor(private readonly notaService: NotaService) {}

  // Criar nota: coordenação e professores
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createNotaDto: CreateNotaDto, @Req() req: Request & { user: Usuario }): Promise<Nota> {
    // passa o usuário autenticado para que o service possa aplicar regras (ex.: professor só para suas disciplinas)
    return await this.notaService.create(createNotaDto, req.user);
  }

  // Listar notas: coordenação e professores (todas) ; alunos podem usar filtro para ver só as próprias (service valida)
  @Roles(Role.COORDENACAO, Role.PROFESSOR, /* alunos podem acessar via filtro, RolesGuard deve permitir Role.ALUNO se implementado */)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true, skipMissingProperties: true }))
  async findAll(@Query() filters: FilterNotaDto, @Req() req: Request & { user: Usuario }): Promise<Nota[]> {
    return await this.notaService.findAll(filters, req.user);
  }

  // Buscar por id: coordenação, professor (se autorizado) e aluno (se for a própria nota)
  @Roles(Role.COORDENACAO, Role.PROFESSOR /* , Role.ALUNO */)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request & { user: Usuario }): Promise<Nota> {
    return await this.notaService.findOne(id, req.user);
  }

  // Atualizar nota: coordenação e professor (service deve validar que professor ministra a disciplina)
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotaDto: UpdateNotaDto,
    @Req() req: Request & { user: Usuario },
  ): Promise<Nota> {
    return await this.notaService.update(id, updateNotaDto, req.user);
  }

  // Remover nota: coordenação e professor (service valida autorização)
  @Roles(Role.COORDENACAO, Role.PROFESSOR)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request & { user: Usuario }): Promise<void> {
    return await this.notaService.remove(id, req.user);
  }
}
