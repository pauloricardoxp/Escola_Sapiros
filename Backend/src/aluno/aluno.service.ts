import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async create(createAlunoDto: CreateAlunoDto): Promise<Aluno> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: Number(createAlunoDto.usuarioId) },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const [dia, mes, ano] = createAlunoDto.data_nascimento.split('/');
    const dataNascimento = new Date(`${ano}-${mes}-${dia}`);

    const aluno = this.alunoRepository.create({
      nome_aluno: createAlunoDto.nome,
      data_nascimento: dataNascimento,
      telefone_aluno: createAlunoDto.telefone,
      usuario,
    });
    return this.alunoRepository.save(aluno);
  }

  async findAll(): Promise<Aluno[]> {
    return this.alunoRepository.find({ relations: ['usuario'] });
  }

  async findOne(matricula: number): Promise<Aluno> {
    const aluno = await this.alunoRepository.findOne({
      where: { matricula_aluno: matricula },
      relations: ['usuario'],
    });
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return aluno;
  }

  async update(matricula: number, updateAlunoDto: UpdateAlunoDto): Promise<Aluno> {
    const aluno = await this.findOne(matricula);

    if (updateAlunoDto.data_nascimento) {
      const [dia, mes, ano] = updateAlunoDto.data_nascimento.split('/');
      aluno.data_nascimento = new Date(`${ano}-${mes}-${dia}`);
    }

    Object.assign(aluno, {
      nome_aluno: updateAlunoDto.nome ?? aluno.nome_aluno,
      telefone_aluno: updateAlunoDto.telefone ?? aluno.telefone_aluno,
    });
    return this.alunoRepository.save(aluno);
  }

  async remove(matricula: number): Promise<void> {
    const aluno = await this.findOne(matricula);
    await this.alunoRepository.remove(aluno);
  }
}
