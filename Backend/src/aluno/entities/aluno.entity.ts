import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('alunos')
export class Aluno {
  @PrimaryColumn() // Agora gerada pela aplicação, não automaticamente pelo DB
  matricula_aluno: string; 

  @Column()
  nome_aluno: string;

  @Column({ type: 'date' }) // Tipo de coluna ajustado para Date
  data_nascimento: Date;

  @Column()
  telefone_aluno: string;

  @Column()
  cpf_aluno: string;

  @Column()
  senha_aluno: string;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}