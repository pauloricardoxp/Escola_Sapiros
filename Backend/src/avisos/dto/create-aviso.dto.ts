import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TipoAviso } from '../entities/aviso.entity';

export class CreateAvisoDto {
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório' })
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'Conteúdo é obrigatório' })
  conteudo: string;

  @IsEnum(TipoAviso, { message: 'Tipo deve ser GERAL, TURMA ou INDIVIDUAL' })
  @IsOptional()
  tipo?: TipoAviso = TipoAviso.GERAL;

  @IsDateString({}, { message: 'Data de publicação deve estar em formato ISO válido' })
  @IsNotEmpty({ message: 'Data de publicação é obrigatória' })
  dataPublicacao: string;

  @IsDateString({}, { message: 'Data de expiração deve estar em formato ISO válido' })
  @IsOptional()
  dataExpiracao?: string;

  @Type(() => Number)
  @IsInt({ message: 'usuarioId deve ser um número inteiro válido' })
  @IsNotEmpty({ message: 'usuarioId é obrigatório' })
  usuarioId: number;

  @IsUUID('4', { message: 'turmaId deve ser um UUID válido' })
  @IsOptional()
  turmaId?: string;
}
