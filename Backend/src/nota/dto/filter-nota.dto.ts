import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TipoAvaliacao } from '../entities/nota.entity';

export class FilterNotaDto {
  @IsString({ message: 'alunoId deve ser a matrícula do aluno' })
  @IsOptional()
  alunoId?: string; // corresponde a matricula_aluno

  @IsUUID('4', { message: 'disciplinaId deve ser um UUID válido' })
  @IsOptional()
  disciplinaId?: string; // corresponde ao id da disciplina

  @IsEnum(TipoAvaliacao, { message: 'Tipo de avaliação deve ser PROVA, TRABALHO, PROJETO, ATIVIDADE ou OUTRO' })
  @IsOptional()
  tipoAvaliacao?: TipoAvaliacao;

  @IsDateString({}, { message: 'Data inicial deve estar em formato ISO válido (YYYY-MM-DD)' })
  @IsOptional()
  dataInicio?: string;

  @IsDateString({}, { message: 'Data final deve estar em formato ISO válido (YYYY-MM-DD)' })
  @IsOptional()
  dataFim?: string;
}
