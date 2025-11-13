import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Role {
  ALUNO = 'aluno',
  PROFESSOR = 'professores',
  COORDENACAO = 'coordenacao',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: false })
  cpf: string;

  @Column({ nullable: false })
  senha: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;
}
