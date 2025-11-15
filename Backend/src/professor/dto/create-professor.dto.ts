import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumberString, Length, IsInt } from 'class-validator';

export class CreateProfessorDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  cpf: string;

  @IsOptional()
  @IsNumberString()
  @Length(10, 11, { message: 'Telefone deve ter 10 ou 11 dígitos numéricos' })
  telefone?: string;

  @IsNotEmpty()
  @IsNumberString()
  usuarioId: number;  
}
