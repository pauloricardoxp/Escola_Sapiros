import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoAviso } from '../entities/aviso.entity';

export class FilterAvisoDto {
  @IsOptional()
  @IsEnum(TipoAviso)
  tipo?: TipoAviso;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  usuarioId?: number;

  @IsOptional()
  @IsUUID()
  turmaId?: string;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @IsOptional()
  @IsString()
  termo?: string;
}
