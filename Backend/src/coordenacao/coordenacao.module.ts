import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordenacaoService } from './coordenacao.service';
import { CoordenacaoController } from './coordenacao.controller';
import { Coordenacao } from './entities/coordenacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coordenacao])],
  controllers: [CoordenacaoController],
  providers: [CoordenacaoService],
})
export class CoordenacaoModule {}
