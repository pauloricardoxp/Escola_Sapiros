import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from '../../usuario/entities/usuario.entity';
import { FuncaoCoordenacao } from '../enums/funcao-coordenacao.enum';



@Entity('coordenacao')
export class Coordenacao {
  @PrimaryGeneratedColumn()
  id_coordenacao: number;

  @Column()
  email_coordenacao: string;

  @Column()
  telefone_coordenacao: string;

  @Column({
    type: 'enum',
    enum: FuncaoCoordenacao,
  })
  funcao: FuncaoCoordenacao;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}














