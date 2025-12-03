import { Module, forwardRef } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsuarioModule } from '../usuario/usuario.module';
import { AlunoModule } from '../aluno/aluno.module';
import { MailService } from '../mail/mail.service';
import { Aluno } from '../aluno/entities/aluno.entity';
import { ResetPasswordToken } from './entities/reset-password-token.entity';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsuarioModule),
    forwardRef(() => AlunoModule),
    PassportModule,
    TypeOrmModule.forFeature([Aluno, ResetPasswordToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_SECRET') ?? 'default_secret';
        const expiresRaw = config.get<string>('JWT_EXPIRES_IN');
        const expiresIn = expiresRaw ? Number(expiresRaw) : 3600;
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, MailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
