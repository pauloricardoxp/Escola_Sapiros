import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Aluno } from '../../aluno/entities/aluno.entity';
import { Disciplina } from '../../disciplina/entities/disciplina.entity';

@Entity('frequencias')
export class Frequencia {
  @PrimaryGeneratedColumn('uuid')
  id_frequencia: string;

  @Column({ type: 'date' })
  data: Date;

  @Column({ default: false })
  presente: boolean;

  @Column({ type: 'text', nullable: true })
  observacao: string;

  @ManyToOne(() => Aluno, { nullable: false })
  @JoinColumn({ name: 'aluno_id', referencedColumnName: 'matricula_aluno' })
  aluno: Aluno;

  @ManyToOne(() => Disciplina, { nullable: false })
  @JoinColumn({ name: 'id_disciplina', referencedColumnName: 'id_disciplina' })
  disciplina: Disciplina;

  // Preenche automático as tabelas com a criação e atualização do ultimo registro para maior controle.

  @CreateDateColumn()
  frequenciacriadoEm: Date;

  @UpdateDateColumn()
  frequenciaatualizadoEm: Date;
}
