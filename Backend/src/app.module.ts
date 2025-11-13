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

console.log('🔍 MYSQL_DB_PASSWORD:', process.env.MYSQL_DB_PASSWORD);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '12345678',
        database: 'sapiros_db',
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
