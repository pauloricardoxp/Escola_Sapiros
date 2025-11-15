import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

class LoginDto {
  @IsNotEmpty()
  @IsString()
  identificador: string; // CPF ou email

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
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
