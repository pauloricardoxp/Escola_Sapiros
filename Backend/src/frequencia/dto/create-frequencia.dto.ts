import {IsBoolean,IsDateString,IsNotEmpty,IsOptional,IsString,IsUUID,} from 'class-validator';

export class CreateFrequenciaDto {
  @IsDateString({}, { message: 'Data deve estar em formato ISO válido (DD-MM-YYYY)' })
  @IsNotEmpty({ message: 'Data é obrigatória' })
  data: string;

  @IsBoolean({ message: 'Presente deve ser um valor booleano' })
  @IsOptional()
  presente?: boolean = false;

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
