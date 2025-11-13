import { FuncaoCoordenacao } from '../enums/funcao-coordenacao.enum';

export class CreateCoordenacaoDto {
  email_coordenacao: string;
  telefone_coordenacao: string;
  funcao: FuncaoCoordenacao;
  usuario_id: number;
}
