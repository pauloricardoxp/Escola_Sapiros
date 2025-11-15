import { IsNotEmpty, IsString, Matches, IsOptional, IsNumberString, Length } from 'class-validator';

export class CreateAlunoDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(11, 11,  { message: 'Cpf deve ter 11 dígitos numéricos' })
  cpf: string;


  @IsNotEmpty()
  @IsString()
  @Length(6, 20,  { message: 'senha deve ter 6 dígitos numéricos no minimo' })
  senha: string;

  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Data de nascimento deve estar no formato DD/MM/YYYY' })
  data_nascimento: string;

  @IsOptional()
  @IsNumberString()
  @Length(10, 11,  { message: 'Telefone deve ter 10 ou 11 dígitos numéricos' })
  telefone?: string;

  
  @IsNotEmpty()
  @IsNumberString()
  usuarioId: number; 
}
