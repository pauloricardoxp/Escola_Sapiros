import { FuncaoCoordenacao } from '../enums/funcao-coordenacao.enum';

export class UpdateCoordenacaoDto {
  email_coordenacao?: string;
  telefone_coordenacao?: string;
  funcao?: FuncaoCoordenacao;
  
}
