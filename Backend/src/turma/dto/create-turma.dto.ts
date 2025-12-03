import {IsArray,IsBoolean,IsDateString,IsNotEmpty,IsOptional,IsString,IsUUID,} from 'class-validator';

export class CreateTurmaDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome da turma é obrigatório' })
  nome_turma: string;   

  @IsString()
  @IsNotEmpty({ message: 'Ano letivo é obrigatório' })
  anoLetivo: string;

  @IsString()
  @IsNotEmpty({ message: 'Período é obrigatório' })
  periodo: string; // Manhã, Tarde, Noite

  @IsDateString({}, { message: 'Data de início deve estar em formato ISO válido' })
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  dataInicio: string;

  @IsDateString({}, { message: 'Data de fim deve estar em formato ISO válido' })
  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  dataFim: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsBoolean()
  @IsOptional()
  ativa?: boolean = true;

  @IsUUID('4', { message: 'professorId deve ser um UUID válido' })
  @IsOptional()
  professorId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Cada alunoId deve ser uma string' })
  alunosIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Cada disciplinaId deve ser um UUID válido' })
  disciplinasIds?: string[];
}
