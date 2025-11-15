import { IsNotEmpty, IsString, Matches, IsOptional, Length, IsEnum } from 'class-validator';
import { Role } from '../../usuario/entities/usuario.entity';

export class CreateAlunoDto {
  // Campos de Usuário necessários para criar o Usuario base
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  @Length(11, 11, { message: 'Cpf deve ter 11 dígitos numéricos' })
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'senha deve ter 6 dígitos numéricos no minimo' })
  senha: string;

  @IsOptional()
  @IsString()
  @Length(10, 11, { message: 'Telefone deve ter 10 ou 11 dígitos numéricos' })
  telefone?: string; 
  
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Role deve ser aluno, professor ou coordenacao' })
  role: Role; 

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Data de nascimento deve estar no formato DD/MM/YYYY' })
  data_nascimento: string;

  @IsNotEmpty()
  @IsString()
  email: string; // Adicionado para a tabela Usuario
}