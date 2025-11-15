import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CoordenacaoService } from './coordenacao.service';
import { CreateCoordenacaoDto } from './dto/create-coordenacao.dto';
import { UpdateCoordenacaoDto } from './dto/update-coordenacao.dto';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('coordenacao')
export class CoordenacaoController {
  constructor(private readonly coordenacaoService: CoordenacaoService) {}

  // Criar: coordenacao
  @Roles('coordenacao')
  @Post()
  create(@Body() createCoordenacaoDto: CreateCoordenacaoDto) {
    return this.coordenacaoService.create(createCoordenacaoDto);
  }

  // Listar: coordenacao
  @Roles('coordenacao')
  @Get()
  findAll() {
    return this.coordenacaoService.findAll();
  }

  // Ver: coordenacao
  @Roles('coordenacao')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordenacaoService.findOne(+id);
  }

  // Atualizar: coordenacao
  @Roles('coordenacao')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoordenacaoDto: UpdateCoordenacaoDto) {
    return this.coordenacaoService.update(+id, updateCoordenacaoDto);
  }

  // Deletar: coordenacao
  @Roles('coordenacao')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordenacaoService.remove(+id);
  }
}
