import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Role {
  ALUNO = 'aluno',
  RESPONSAVEL = 'responsavel',
  PROFESSOR = 'professor',
  SECRETARIA = 'secretaria',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  senha: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;
}
