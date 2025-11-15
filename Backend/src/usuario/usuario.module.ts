import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    AuthModule, // habilita JwtStrategy e guards
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
