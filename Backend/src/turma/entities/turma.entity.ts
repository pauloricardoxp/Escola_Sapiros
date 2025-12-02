import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn,} from 'typeorm';
import { Aluno } from '../../aluno/entities/aluno.entity';
import { Disciplina } from '../../disciplina/entities/disciplina.entity';
import { Aviso } from '../../avisos/entities/aviso.entity';
import { Professor } from '../../professor/entities/professor.entity';


@Entity('turmas')
export class Turma {
  @PrimaryGeneratedColumn('uuid')
  id_turma: string;

  @Column()
  nome_turma: string;

  @Column({ name: 'ano_letivo' })
  anoLetivo: string;

  @Column()
  periodo: string; // Manhã, Tarde, Noite

  @Column({ name: 'data_inicio', type: 'date' })
  dataInicio: Date;

  @Column({ name: 'data_fim', type: 'date' })
  dataFim: Date;

  @Column('text', { nullable: true })
  descricao: string;

  @Column({ default: true })
  ativa: boolean;

  // Relacionamentos
// Turma.ts
@ManyToMany(() => Aluno, aluno => aluno.turmas)
@JoinTable({
  name: 'turma_alunos',
  joinColumn: { name: 'turma_id', referencedColumnName: 'id_turma' },
  inverseJoinColumn: { name: 'aluno_id', referencedColumnName: 'id' },
})
alunos: Aluno[];



  @ManyToMany(() => Disciplina, disciplina => disciplina.turmas)
  @JoinTable({
    name: 'turma_disciplinas',
    joinColumn: { name: 'turma_id', referencedColumnName: 'id_turma' },
    inverseJoinColumn: { name: 'disciplina_id', referencedColumnName: 'id_disciplina' }
  })
  disciplinas: Disciplina[];

  @OneToMany(() => Aviso, aviso => aviso.turma)
  avisos: Aviso[];

  @ManyToOne(() => Professor, { nullable: true })
  @JoinColumn({ name: 'professor_id' })
  professor?: Professor;

  // Preenche automático as tabelas com a criação e atualização do ultimo registro para maior controle.

  @CreateDateColumn()
  turmacriadoEm: Date;

  @UpdateDateColumn()
  turmaatualizadoEm: Date;
}