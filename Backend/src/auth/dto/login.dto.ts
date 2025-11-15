import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  identificador: string; // pode ser CPF ou email

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 64 caracteres' })
  senha: string;
}
