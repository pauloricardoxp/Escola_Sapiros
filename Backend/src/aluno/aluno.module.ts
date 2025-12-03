import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from './entities/aluno.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Turma } from '../turma/entities/turma.entity';
import { AlunoService } from './aluno.service';
import { AlunoController } from './aluno.controller';
import { AuthModule } from '../auth/auth.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Aluno, Usuario, Turma]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsuarioModule),
    forwardRef(() => MailModule),
  ],
  controllers: [AlunoController],
  providers: [AlunoService],
  exports: [AlunoService],
})
export class AlunoModule {}
