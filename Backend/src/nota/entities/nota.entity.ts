import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Aluno } from '../../aluno/entities/aluno.entity';
import { Disciplina } from '../../disciplina/entities/disciplina.entity';

export enum TipoAvaliacao {
  PROVA = 'PROVA',
  TRABALHO = 'TRABALHO',
  PROJETO = 'PROJETO',
  ATIVIDADE = 'ATIVIDADE',
  OUTRO = 'OUTRO'
}

@Entity('notas')
export class Nota {
  @PrimaryGeneratedColumn('uuid')
  id_nota: string;

  @Column('decimal', { precision: 5, scale: 2 })
  valor: number;

  @Column({
    type: 'enum',
    enum: TipoAvaliacao,
    default: TipoAvaliacao.PROVA
  })
  tipoAvaliacao: TipoAvaliacao;

  @Column({ type: 'date' })
  data: Date;

  @Column('text', { nullable: true })
  observacao: string;

  @ManyToOne(() => Aluno, { nullable: false })
  @JoinColumn({ name: 'aluno_id', referencedColumnName: 'matricula_aluno' })
  aluno: Aluno;

  @ManyToOne(() => Disciplina, { nullable: false })
  @JoinColumn({ name: 'disciplina_id', referencedColumnName: 'id_disciplina' })
  disciplina: Disciplina;

  // Preenche automático as tabelas com a criação e atualização do ultimo registro para maior controle.

  @CreateDateColumn()
  notacriadoEm: Date;

  @UpdateDateColumn()
  notaatualizadoEm: Date;
}

