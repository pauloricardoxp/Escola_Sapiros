import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString } from 'class-validator';

// DTO simples para login
class LoginDto {
  @IsNotEmpty()
  @IsString()
  identificador: string; // pode ser CPF ou Email

  @IsNotEmpty()
  @IsString()
  senha: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.identificador, body.senha);
  }
}
