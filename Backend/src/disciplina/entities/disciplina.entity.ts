import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Frequencia } from '../../frequencia/entities/frequencia.entity';
import { Nota } from '../../nota/entities/nota.entity';
import { Turma } from '../../turma/entities/turma.entity';

@Entity('disciplinas')
export class Disciplina {
  @PrimaryGeneratedColumn('uuid')
  id_disciplina: string;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nome_disciplina: string;

  @Column('text', { nullable: true })
  descricao_turma: string;

  @Column('int')
  cargaHoraria: number;

  @OneToMany(() => Frequencia, frequencia => frequencia.disciplina)
  frequencias: Frequencia[];

  @OneToMany(() => Nota, nota => nota.disciplina)
  notas: Nota[];

  @ManyToMany(() => Turma, turma => turma.disciplinas)
  turmas: Turma[];

  // Preenche automático as tabelas com a criação e atualização do ultimo registro para maior controle.

  @CreateDateColumn()
  disciplinacriadoEm: Date;

  @UpdateDateColumn()
  disciplinaatualizadoEm: Date;
}

