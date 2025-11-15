import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional, IsNumberString, IsString, Length, MaxLength } from 'class-validator';
import { Role } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(11, 11, { message: 'CPF deve ter 11 dígitos numéricos' })
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  senha: string;

  @IsEnum(Role, { message: 'Role deve ser aluno, professor ou coordenacao' })
  role: Role;
}
