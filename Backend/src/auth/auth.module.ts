import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioModule } from '../usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UsuarioModule,
    JwtModule.register({
      secret: 'SUA_CHAVE_SECRETA_SUPER_SEGURA', 
      signOptions: { expiresIn: '1h' }, // token expira em 1 hora
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule], 
})
export class AuthModule {}
