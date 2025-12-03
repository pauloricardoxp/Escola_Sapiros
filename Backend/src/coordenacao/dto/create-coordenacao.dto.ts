import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { FuncaoCoordenacao } from '../enums/funcao-coordenacao.enum';

export class CreateCoordenacaoDto {
  @IsNotEmpty({ message: 'usuarioId é obrigatório' })
  @IsUUID('4', { message: 'usuarioId deve ser um UUID válido' })
  usuarioId: string;

  @IsNotEmpty({ message: 'funcao é obrigatória' })
  @IsEnum(FuncaoCoordenacao, {
    message: 'Função deve ser coordenador, diretor, secretario ou administrador',
  })
  funcao: FuncaoCoordenacao;
}
