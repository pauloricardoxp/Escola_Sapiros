import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('professores')
export class Professor {
  @PrimaryGeneratedColumn()
  id_professor: number;

  @Column()
  nome_professor: string;

  @Column()
  cpf_professor: string;

  @Column()
  email_professor: string;

  @Column()
  telefone_professor: string;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
