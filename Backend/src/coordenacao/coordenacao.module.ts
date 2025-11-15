import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coordenacao } from './entities/coordenacao.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CoordenacaoService } from './coordenacao.service';
import { CoordenacaoController } from './coordenacao.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coordenacao, Usuario]),
    AuthModule, // habilita JwtStrategy e guards
  ],
  controllers: [CoordenacaoController],
  providers: [CoordenacaoService],
  exports: [CoordenacaoService],
})
export class CoordenacaoModule {}
