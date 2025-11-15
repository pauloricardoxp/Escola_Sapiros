import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessorModule } from './professor/professor.module';
import { AlunoModule } from './aluno/aluno.module';
import { CoordenacaoModule } from './coordenacao/coordenacao.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.MYSQL_DB_HOST,
        port: Number(process.env.MYSQL_DB_PORT),
        username: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    UsuarioModule,
    AuthModule,
    ProfessorModule,
    AlunoModule,
    CoordenacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
