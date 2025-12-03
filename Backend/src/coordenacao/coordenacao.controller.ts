import { Body, Controller, Delete, Get,Param, ParseUUIDPipe, Patch, Post, Req,UseGuards,UsePipes, ValidationPipe,} from '@nestjs/common';
import type { Request } from 'express';
import { CoordenacaoService } from './coordenacao.service';
import { CreateCoordenacaoDto } from './dto/create-coordenacao.dto';
import { UpdateCoordenacaoDto } from './dto/update-coordenacao.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role, Usuario } from '../usuario/entities/usuario.entity';
import { Coordenacao } from './entities/coordenacao.entity';

type AuthRequest = Request & { user?: Usuario | any };

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('coordenacao')
export class CoordenacaoController {
  constructor(private readonly coordenacaoService: CoordenacaoService) {}

  // Criar: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() createCoordenacaoDto: CreateCoordenacaoDto,
    @Req() req: AuthRequest,
  ): Promise<Coordenacao> {
    return await this.coordenacaoService.create(createCoordenacaoDto, req.user);
  }

  // Listar: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Get()
  async findAll(@Req() req: AuthRequest): Promise<Coordenacao[]> {
    return await this.coordenacaoService.findAll(req.user);
  }

  // Ver: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<Coordenacao> {
    return await this.coordenacaoService.findOne(id, req.user);
  }

  // Atualizar: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCoordenacaoDto: UpdateCoordenacaoDto,
    @Req() req: AuthRequest,
  ): Promise<Coordenacao> {
    return await this.coordenacaoService.update(id, updateCoordenacaoDto, req.user);
  }

  // Deletar: apenas coordenação
  @Roles(Role.COORDENACAO)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    return await this.coordenacaoService.remove(id, req.user);
  }
}
