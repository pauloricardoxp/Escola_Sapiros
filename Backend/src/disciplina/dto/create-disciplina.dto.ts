import {IsArray,IsInt,IsNotEmpty,IsOptional,IsPositive,IsString,IsUUID,} from 'class-validator';

export class CreateDisciplinaDto {
  @IsString({ message: 'Código deve ser texto' })
  @IsNotEmpty({ message: 'Código é obrigatório' })
  codigo: string;

  @IsString({ message: 'Nome da disciplina deve ser texto' })
  @IsNotEmpty({ message: 'Nome da disciplina é obrigatório' })
  nome_disciplina: string;

  @IsString({ message: 'Descrição deve ser texto' })
  @IsOptional()
  descricao_turma?: string;

  @IsInt({ message: 'Carga horária deve ser um número inteiro' })
  @IsPositive({ message: 'Carga horária deve ser positiva' })
  cargaHoraria: number;

  @IsOptional()
  @IsArray({ message: 'turmasIds deve ser uma lista de UUIDs' })
  @IsUUID('4', { each: true, message: 'Cada turmaId deve ser um UUID válido' })
  turmasIds?: string[];
}
