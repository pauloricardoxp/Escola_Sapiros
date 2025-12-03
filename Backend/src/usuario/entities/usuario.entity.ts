import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  ALUNO = 'aluno',
  PROFESSOR = 'professor',
  COORDENACAO = 'coordenacao',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  senha: string;

  @Column({
    type: 'timestamp',
    name: 'senha_expira_em',
    default: () => "DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY)",
  })
  senhaExpiraEm: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  senhaAtualizadaEm: Date;

  @Column({ unique: true, nullable: true })
  telefone: string;

  @Column({ type: 'date' })
  data_nascimento: Date;

  @Column({
    type: 'enum',
    enum: ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'],
    default: 'NAO_INFORMADO',
  })
  sexo: string;

  @Column({ name: 'rg_numero' })
  rgNumero: string;

  @Column({ name: 'rg_data_emissao', type: 'date', nullable: true })
  rgDataEmissao?: Date;

  @Column({ name: 'rg_orgao_emissor', nullable: true })
  rgOrgaoEmissor?: string;

  @Column({ name: 'endereco_logradouro' })
  enderecoLogradouro: string;

  @Column({ name: 'endereco_numero' })
  enderecoNumero: string;

  @Column({ name: 'endereco_cep' })
  enderecoCep: string;

  @Column({ name: 'endereco_complemento', nullable: true })
  enderecoComplemento?: string;

  @Column({ name: 'endereco_bairro' })
  enderecoBairro: string;

  @Column({ name: 'endereco_estado', length: 2 })
  enderecoEstado: string;

  @Column({ name: 'endereco_cidade' })
  enderecoCidade: string;

  @Column()
  nacionalidade: string;

  @Column()
  naturalidade: string;

  @Column({ name: 'possui_necessidades_especiais', default: false })
  possuiNecessidadesEspeciais: boolean;

  @Column({ name: 'descricao_necessidades_especiais', nullable: true })
  descricaoNecessidadesEspeciais?: string;

  @Column({ name: 'possui_alergias', default: false })
  possuiAlergias: boolean;

  @Column({ name: 'descricao_alergias', nullable: true })
  descricaoAlergias?: string;

  @Column({ name: 'autorizacao_uso_imagem', default: false })
  autorizacaoUsoImagem: boolean;

  @CreateDateColumn()
  UsuariocriadoEm: Date;

  @UpdateDateColumn()
  UsuarioatualizadoEm: Date;

  @Column({ type: 'enum', enum: Role })
  role: Role;
}
