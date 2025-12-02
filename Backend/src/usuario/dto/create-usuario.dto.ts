import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
  IsString,
  Length,
  IsBoolean,
  IsDateString,
  Matches,
} from 'class-validator';
import { Role } from '../entities/usuario.entity';

export enum Sexo {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  OUTRO = 'OUTRO',
  NAO_INFORMADO = 'NAO_INFORMADO',
}

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

  // SENHA FORTALECIDA
  @IsNotEmpty()
  @IsString()
  @Length(8, 64, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]).{8,}$/,
    {
      message:
        'A senha deve conter ao menos 1 letra maiúscula, 1 número e 1 caractere especial.',
    },
  )
  senha: string;

  @IsOptional()
  @IsNumberString()
  @Length(10, 15)
  telefone?: string;

  @IsNotEmpty()
  @IsDateString()
  data_nascimento: string;

  @IsEnum(Sexo)
  sexo: Sexo;

  @IsNotEmpty()
  @IsString()
  rgNumero: string;

  @IsOptional()
  @IsDateString()
  rgDataEmissao?: string;

  @IsOptional()
  @IsString()
  rgOrgaoEmissor?: string;

  @IsNotEmpty()
  @IsString()
  enderecoLogradouro: string;

  @IsNotEmpty()
  @IsString()
  enderecoNumero: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 8)
  enderecoCep: string;

  @IsOptional()
  @IsString()
  enderecoComplemento?: string;

  @IsNotEmpty()
  @IsString()
  enderecoBairro: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  enderecoEstado: string;

  @IsNotEmpty()
  @IsString()
  enderecoCidade: string;

  @IsNotEmpty()
  @IsString()
  nacionalidade: string;

  @IsNotEmpty()
  @IsString()
  naturalidade: string;

  @IsOptional()
  @IsBoolean()
  possuiNecessidadesEspeciais?: boolean;

  @IsOptional()
  @IsString()
  descricaoNecessidadesEspeciais?: string;

  @IsOptional()
  @IsBoolean()
  possuiAlergias?: boolean;

  @IsOptional()
  @IsString()
  descricaoAlergias?: string;

  @IsOptional()
  @IsBoolean()
  autorizacaoUsoImagem?: boolean;

  @IsEnum(Role)
  role: Role;
}

