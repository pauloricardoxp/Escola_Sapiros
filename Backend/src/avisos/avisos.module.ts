import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvisosService } from './avisos.service';
import { AvisosController } from './avisos.controller';
import { Aviso } from './entities/aviso.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Turma } from '../turma/entities/turma.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aviso, Usuario, Turma])],
  controllers: [AvisosController],
  providers: [AvisosService],
  exports: [AvisosService],
})
export class AvisosModule {}
