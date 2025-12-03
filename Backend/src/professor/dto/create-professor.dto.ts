import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProfessorDto {
 
 @IsNotEmpty()
  @IsUUID()
  usuarioId: string;
 
 
  @IsOptional()
  @IsString()
  formacao?: string;

  
}
