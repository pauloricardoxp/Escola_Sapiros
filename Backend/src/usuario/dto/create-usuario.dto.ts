import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional, Matches } from 'class-validator';
import { Role } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'CPF deve ter 11 dígitos numéricos' })
  cpf: string;

  @MinLength(6)
  senha: string;

  @IsEnum(Role, { message: 'Role deve ser aluno, responsavel, professor ou secretaria' })
  role: Role;
}
