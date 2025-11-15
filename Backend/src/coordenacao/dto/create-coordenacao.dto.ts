import { IsEmail, IsNotEmpty, IsOptional, Length, IsEnum, IsString, IsNumberString } from 'class-validator';
import { FuncaoCoordenacao } from '../enums/funcao-coordenacao.enum';

export class CreateCoordenacaoDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumberString()
  @Length(10, 11, { message: 'Telefone deve ter 10 ou 11 dígitos numéricos' })
  telefone?: string;

  @IsNotEmpty()
  @IsNumberString()
  usuarioId: number;

  @IsNotEmpty()
  @IsEnum(FuncaoCoordenacao, { message: 'Função deve ser coordenador, diretor, secretario ou administrador' })
  funcao: FuncaoCoordenacao;
}
