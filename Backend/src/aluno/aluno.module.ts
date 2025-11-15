import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from './entities/aluno.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { AlunoService } from './aluno.service';
import { AlunoController } from './aluno.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Aluno, Usuario]),
    AuthModule, // habilita JwtStrategy e guards
  ],
  controllers: [AlunoController],
  providers: [AlunoService],
  exports: [AlunoService],
})
export class AlunoModule {}
