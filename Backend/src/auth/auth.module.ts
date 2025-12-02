import { Module, forwardRef } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsuarioModule),
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_SECRET') ?? 'default_secret';

        // JWT_EXPIRES_IN deve vir em segundos
        const expiresRaw = config.get<string>('JWT_EXPIRES_IN');
        const expiresIn = expiresRaw ? Number(expiresRaw) : 3600; // 1h padrão

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
