import {Controller, Get, Param,Post,Body,Patch,Delete, UseGuards,UsePipes,ValidationPipe,} from '@nestjs/common';
import { TurmaService } from './turma.service';
import { Turma } from './entities/turma.entity';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('turmas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  // Listar todas as turmas: coordenação e professores
  @Roles('coordenacao', 'professores')
  @Get()
  async findAll(): Promise<Turma[]> {
    return await this.turmaService.findAll();
  }

  // Buscar turma por id (UUID)
  @Roles('coordenacao', 'professores')
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Turma | null> {
    return await this.turmaService.findOne(id);
  }

  // Criar turma: apenas coordenação
  @Roles('coordenacao')
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() dto: CreateTurmaDto): Promise<Turma> {
    return await this.turmaService.create(dto);
  }

  // Atualizar turma: apenas coordenação
  @Roles('coordenacao')
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTurmaDto,
  ): Promise<Turma> {
    return await this.turmaService.update(id, dto);
  }

  // Remover turma: apenas coordenação
  @Roles('coordenacao')
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.turmaService.remove(id);
  }
}
