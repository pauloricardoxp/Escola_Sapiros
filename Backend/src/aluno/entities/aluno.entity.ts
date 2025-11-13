import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('alunos')
export class Aluno {
  @PrimaryGeneratedColumn()
  matricula_aluno: number; 

  @Column()
  nome_aluno: string;

  @Column()
  data_nascimento: Date;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
