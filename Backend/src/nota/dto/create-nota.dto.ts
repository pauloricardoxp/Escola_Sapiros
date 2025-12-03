import { Type } from 'class-transformer';
import {IsDateString,IsEnum, IsNotEmpty,IsNumber,IsOptional,IsString,IsUUID, Max,Min,} from 'class-validator';
import { TipoAvaliacao } from '../entities/nota.entity';

export class CreateNotaDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ser numérico com até 2 casas decimais' })
  @Min(0, { message: 'Nota mínima é 0' })
  @Max(10, { message: 'Nota máxima é 10' })
  valor: number;

  @IsEnum(TipoAvaliacao, { message: 'Tipo de avaliação deve ser PROVA, TRABALHO, PROJETO, ATIVIDADE ou OUTRO' })
  @IsOptional()
  tipoAvaliacao?: TipoAvaliacao = TipoAvaliacao.PROVA;

  @IsDateString({}, { message: 'Data deve estar em formato ISO válido (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Data é obrigatória' })
  data: string;

  @IsString({ message: 'Observação deve ser texto' })
  @IsOptional()
  observacao?: string;

  @IsString({ message: 'alunoId deve ser a matrícula do aluno' })
  @IsNotEmpty({ message: 'alunoId é obrigatório' })
  alunoId: string; // corresponde a matricula_aluno

  @IsUUID('4', { message: 'disciplinaId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'disciplinaId é obrigatório' })
  disciplinaId: string; // corresponde ao id da disciplina
}
