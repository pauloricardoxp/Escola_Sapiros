import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class FrequenciaFilterDto {
  @IsString({ message: 'alunoId deve ser a matrícula do aluno' })
  @IsOptional()
  alunoId?: string; // corresponde a matricula_aluno

  @IsUUID('4', { message: 'disciplinaId deve ser um UUID válido' })
  @IsOptional()
  disciplinaId?: string; // corresponde ao id da disciplina

  @IsDateString({}, { message: 'Data inicial deve estar em formato ISO válido (YYYY-MM-DD)' })
  @IsOptional()
  dataInicio?: string;

  @IsDateString({}, { message: 'Data final deve estar em formato ISO válido (YYYY-MM-DD)' })
  @IsOptional()
  dataFim?: string;

  @IsBoolean({ message: 'Presente deve ser um valor booleano' })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return undefined;
  })
  presente?: boolean;
}
