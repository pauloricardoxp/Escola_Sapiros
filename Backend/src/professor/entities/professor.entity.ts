import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Turma } from '../../turma/entities/turma.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('professores')
export class Professor {
  @PrimaryGeneratedColumn('uuid')
  id_professor: string;

  @Column('text', { nullable: true })
  formacao: string;

  @OneToMany(() => Turma, turma => turma.professor)
  turmas: Turma[];

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario | null;


  // Preenche automático as tabelas com a criação e atualização do ultimo registro para maior controle.

  @CreateDateColumn()
  ProfessorcriadoEm: Date;

  @UpdateDateColumn()
  ProfessoratualizadoEm: Date;
}
