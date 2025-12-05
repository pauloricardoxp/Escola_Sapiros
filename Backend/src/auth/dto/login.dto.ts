import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  identificador: string; // pode ser matrícula, cpf ou email

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  senha: string;
}
