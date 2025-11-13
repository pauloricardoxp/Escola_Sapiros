import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoordenacaoService } from './coordenacao.service';
import { CreateCoordenacaoDto } from './dto/create-coordenacao.dto';
import { UpdateCoordenacaoDto } from './dto/update-coordenacao.dto';

@Controller('coordenacao')
export class CoordenacaoController {
  constructor(private readonly coordenacaoService: CoordenacaoService) {}

  @Post()
  create(@Body() createCoordenacaoDto: CreateCoordenacaoDto) {
    return this.coordenacaoService.create(createCoordenacaoDto);
  }

  @Get()
  findAll() {
    return this.coordenacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordenacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoordenacaoDto: UpdateCoordenacaoDto) {
    return this.coordenacaoService.update(+id, updateCoordenacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordenacaoService.remove(+id);
  }
}
