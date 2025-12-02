import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Frequencia } from './entities/frequencia.entity';
import { FrequenciaService } from './frequencia.service';
import { FrequenciaController } from './frequencia.controller';

import { Aluno } from '../aluno/entities/aluno.entity';
import { Disciplina } from '../disciplina/entities/disciplina.entity';
import { Turma } from '../turma/entities/turma.entity';
import { Professor } from '../professor/entities/professor.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Frequencia,
      Aluno,
      Disciplina,
      Turma,        // ✅ adiciona isto!
      Professor,
      Usuario,
    ]),
  ],
  controllers: [FrequenciaController],
  providers: [FrequenciaService],
  exports: [FrequenciaService],
})
export class FrequenciaModule {}
