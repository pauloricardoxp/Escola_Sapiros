import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Nota } from './entities/nota.entity';
import { NotaService } from './nota.service';
import { NotaController } from './nota.controller';

import { Aluno } from '../aluno/entities/aluno.entity';
import { Disciplina } from '../disciplina/entities/disciplina.entity';
import { Turma } from '../turma/entities/turma.entity';
import { Professor } from '../professor/entities/professor.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nota,
      Aluno,
      Disciplina,
      Turma,      
      Professor,
      Usuario,
    ]),
  ],
  controllers: [NotaController],
  providers: [NotaService],
  exports: [NotaService],
})
export class NotaModule {}
