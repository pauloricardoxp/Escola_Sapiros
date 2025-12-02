import { IsString, IsOptional, Length, IsDateString, IsEmail, IsEnum, IsArray } from 'class-validator';
import { CreateUsuarioDto, Sexo } from '../../usuario/dto/create-usuario.dto';

export class CreateAlunoDto extends CreateUsuarioDto {
  @IsString()
  serieAno: string;

  @IsOptional()
  @IsString()
  escolaOrigem?: string;

  @IsOptional()
  @IsString()
  responsavelNome?: string;

  @IsOptional()
  @IsDateString()
  responsavel_Data_Nascimento?: Date;

  @IsOptional()
  @IsEnum(Sexo)
  responsavel_sexo?: Sexo;

  @IsOptional()
  @IsString()
  responsavel_nacionalidade?: string;

  @IsOptional()
  @IsString()
  responsavel_naturalidade?: string;

  @IsOptional()
  @IsString()
  responsavelCpf?: string;

  @IsOptional()
  @IsString()
  responsavelRg?: string;

  @IsOptional()
  @IsString()
  responsavel_rg_OrgaoEmissor?: string;

  @IsOptional()
  @IsString()
  responsavelTelefone?: string;

  @IsOptional()
  @IsEmail()
  responsavelEmail?: string;

  @IsOptional()
  @IsString()
  responsavelCep?: string;

  @IsOptional()
  @IsString()
  responsavelLogradouro?: string;

  @IsOptional()
  @IsString()
  responsavelNumero?: string;

  @IsOptional()
  @IsString()
  responsavelComplemento?: string;

  @IsOptional()
  @IsString()
  responsavelBairro?: string;

  @IsOptional()
  @IsString()
  responsavelCidade?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  responsavelEstado?: string;

  @IsOptional()
  @IsArray()
  turmasIds?: string[];
}
