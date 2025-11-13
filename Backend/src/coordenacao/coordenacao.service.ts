import { Injectable } from '@nestjs/common';
import { CreateCoordenacaoDto } from './dto/create-coordenacao.dto';
import { UpdateCoordenacaoDto } from './dto/update-coordenacao.dto';

@Injectable()
export class CoordenacaoService {
  create(createCoordenacaoDto: CreateCoordenacaoDto) {
    return 'This action adds a new coordenacao';
  }

  findAll() {
    return `This action returns all coordenacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coordenacao`;
  }

  update(id: number, updateCoordenacaoDto: UpdateCoordenacaoDto) {
    return `This action updates a #${id} coordenacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} coordenacao`;
  }
}
