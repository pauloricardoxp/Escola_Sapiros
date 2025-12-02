import { Column, ManyToMany, CreateDateColumn, UpdateDateColumn, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Turma } from '../../turma/entities/turma.entity';

@Entity('alunos')
export class Aluno {
  @PrimaryColumn('uuid')
  id: string; // O ID é a chave primária da tabela 'alunos'

  @OneToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' }) // O ID também é a chave estrangeira para 'usuarios'
  usuario: Usuario;

  @Column({ name: 'matricula_aluno', unique: true })
  matricula_aluno: string;

  @Column()
  serieAno: string;

  @Column({ nullable: true })
  escolaOrigem?: string;

  @Column({ nullable: true })
  responsavelNome?: string;

  @Column({ type: 'date', nullable: true })
  responsavel_Data_Nascimento?: Date;

  @Column({
    type: 'enum',
    enum: ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'],
    default: 'NAO_INFORMADO',
  })
  responsavel_sexo?: string;

  @Column({ nullable: true })
  responsavel_nacionalidade?: string;

  @Column({ nullable: true })
  responsavel_naturalidade?: string;

  @Column({ nullable: true })
  responsavelCpf?: string;

  @Column({ nullable: true })
  responsavelRg?: string;

  @Column({ nullable: true })
  responsavel_rg_OrgaoEmissor?: string;

  @Column({ nullable: true })
  responsavelTelefone?: string;

  @Column({ nullable: true })
  responsavelEmail?: string;

  @Column({ nullable: true })
  responsavelCep?: string;

  @Column({ nullable: true })
  responsavelLogradouro?: string;

  @Column({ nullable: true })
  responsavelNumero?: string;

  @Column({ nullable: true })
  responsavelComplemento?: string;

  @Column({ nullable: true })
  responsavelBairro?: string;

  @Column({ nullable: true })
  responsavelCidade?: string;

  @Column({ length: 2, nullable: true })
  responsavelEstado?: string;

  @ManyToMany(() => Turma, turma => turma.alunos)
  turmas?: Turma[];

  @CreateDateColumn()
  AlunocriadoEm: Date;

  @UpdateDateColumn()
  AlunoatualizadoEm: Date;
}
