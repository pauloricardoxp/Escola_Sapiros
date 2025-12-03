import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Turma } from '../../turma/entities/turma.entity';

export enum TipoAviso {
  GERAL = 'GERAL',
  TURMA = 'TURMA',
  INDIVIDUAL = 'INDIVIDUAL'
}

@Entity('avisos')
export class Aviso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column('text')
  conteudo: string;

  @Column({
    type: 'enum',
    enum: TipoAviso,
    default: TipoAviso.GERAL
  })
  tipo: TipoAviso;

  @Column({ name: 'data_publicacao', type: 'timestamp' })
  dataPublicacao: Date;

  @Column({ name: 'data_expiracao', type: 'timestamp', nullable: true })
  dataExpiracao?: Date;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Turma, { nullable: true })
  @JoinColumn({ name: 'turma_id' })
  turma?: Turma | null;

  // Preenche automático as tabelas com a criação e atualização do ultimo registro para maior controle.

  @CreateDateColumn()
  avisocriadoEm: Date;

  @UpdateDateColumn()
  avisoatualizadoEm: Date;
}
