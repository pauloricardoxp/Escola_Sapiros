import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { Role } from '../../usuario/entities/usuario.entity';

export class LoginDto {
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @ValidateIf((dto) => dto.role === Role.ALUNO)
  @IsNotEmpty()
  @IsString()
  matricula?: string;

  @ValidateIf((dto) => dto.role !== Role.ALUNO)
  @IsNotEmpty()
  @IsString()
  identificador?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  senha: string;
}
