import { IsString, Matches, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class MatriculaParamDto {
    @Type(() => String)
    @IsString()
    @Length(10, 10, { message: 'A matrícula deve ter 10 dígitos.' })
    @Matches(/^\d{10}$/, { message: 'A matrícula deve ser numérica e ter 10 dígitos (ANOMESSEQUENCIA).' })
    matricula: string;
}