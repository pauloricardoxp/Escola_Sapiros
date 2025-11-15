import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Aluno } from './entities/aluno.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  private async generateMatricula(): Promise<string> {
    const today = new Date();
    const ano = today.getFullYear().toString();
    const mes = (today.getMonth() + 1).toString().padStart(2, '0');
    const prefixo = ano + mes;

    const ultimaMatricula = await this.alunoRepository.findOne({
      where: { matricula_aluno: Like(`${prefixo}%`) },
      order: { matricula_aluno: 'DESC' },
    });

    let sequencia = 1;

    if (ultimaMatricula) {
      const ultimaSequencia = parseInt(ultimaMatricula.matricula_aluno.slice(-4));
      sequencia = ultimaSequencia + 1;
    }

    const sequenciaStr = sequencia.toString().padStart(4, '0');

    return prefixo + sequenciaStr;
  }

  async create(createAlunoDto: CreateAlunoDto): Promise<Aluno> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createAlunoDto.senha, saltRounds);

    const novoUsuario = this.usuarioRepository.create({
      nome: createAlunoDto.nome,
      email: createAlunoDto.email,
      cpf: createAlunoDto.cpf,
      senha: hashedPassword,
      telefone: createAlunoDto.telefone,
      role: createAlunoDto.role,
    });

    try {
      await this.usuarioRepository.save(novoUsuario);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.message.includes('Duplicate entry')) {
        throw new ConflictException('CPF ou Email já cadastrado.');
      }
      throw error;
    }

    const matricula = await this.generateMatricula();

    const [dia, mes, ano] = createAlunoDto.data_nascimento.split('/');
    const dataNascimento = new Date(Number(ano), Number(mes) - 1, Number(dia));
    
    const aluno = this.alunoRepository.create({
      matricula_aluno: matricula,
      nome_aluno: createAlunoDto.nome,
      data_nascimento: dataNascimento,
      telefone_aluno: createAlunoDto.telefone,
      cpf_aluno: createAlunoDto.cpf,
      senha_aluno: hashedPassword,
      usuario: novoUsuario,
    });
    return this.alunoRepository.save(aluno);
  }

  async findAll(): Promise<Aluno[]> {
    return this.alunoRepository.find({ relations: ['usuario'] });
  }

  async findOne(matricula: string): Promise<Aluno> {
    const aluno = await this.alunoRepository.findOne({
      where: { matricula_aluno: matricula },
      relations: ['usuario'],
    });
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return aluno;
  }

  async update(matricula: string, updateAlunoDto: UpdateAlunoDto): Promise<Aluno> {
    const aluno = await this.findOne(matricula);

    if (updateAlunoDto.data_nascimento) {
      const [dia, mes, ano] = updateAlunoDto.data_nascimento.split('/');
      aluno.data_nascimento = new Date(Number(ano), Number(mes) - 1, Number(dia));
    }

    Object.assign(aluno, {
      nome_aluno: updateAlunoDto.nome ?? aluno.nome_aluno,
      telefone_aluno: updateAlunoDto.telefone ?? aluno.telefone_aluno,
    });
    return this.alunoRepository.save(aluno);
  }

  async remove(matricula: string): Promise<void> {
    const aluno = await this.findOne(matricula);
    await this.alunoRepository.remove(aluno);
  }
}