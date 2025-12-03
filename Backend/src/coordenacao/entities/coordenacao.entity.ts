import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Usuario } from '../../usuario/entities/usuario.entity';
import { FuncaoCoordenacao } from '../enums/funcao-coordenacao.enum';


@Entity('coordenacao')
export class Coordenacao {
  @PrimaryGeneratedColumn('uuid')
  id_coordenacao: string;

  @Column({
    type: 'enum',
    enum: FuncaoCoordenacao,
  })
  funcao: FuncaoCoordenacao;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;


  // Preenche automático as tabelas com a criação e atualização do ultimo registro para maior controle.
  
    @CreateDateColumn()
    CoordenacaocriadoEm: Date;
  
    @UpdateDateColumn()
    coordenacaoatualizadoEm: Date;
}














