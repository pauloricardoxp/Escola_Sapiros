import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurmaService } from './turma.service';
import { TurmaController } from './turma.controller';
import { Turma } from './entities/turma.entity';
import { Aluno } from '../aluno/entities/aluno.entity';
import { Disciplina } from '../disciplina/entities/disciplina.entity';
import { Professor } from '../professor/entities/professor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turma, Aluno, Disciplina, Professor])],
  controllers: [TurmaController],
  providers: [TurmaService],
  exports: [TurmaService],
})
export class TurmaModule {}
