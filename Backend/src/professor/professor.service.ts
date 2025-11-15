import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professor } from './entities/professor.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createProfessorDto: CreateProfessorDto): Promise<Professor> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: Number(createProfessorDto.usuarioId) },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const professor = this.professorRepository.create({
      nome_professor: createProfessorDto.nome,
      cpf_professor: createProfessorDto.cpf,
      email_professor: createProfessorDto.email,
      telefone_professor: createProfessorDto.telefone,
      usuario,
    });
    return this.professorRepository.save(professor);
  }

  async findAll(): Promise<Professor[]> {
    return this.professorRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Professor> {
    const professor = await this.professorRepository.findOne({
      where: { id_professor: id },
      relations: ['usuario'],
    });
    if (!professor) throw new NotFoundException('Professor não encontrado');
    return professor;
  }

  async update(id: number, updateProfessorDto: UpdateProfessorDto): Promise<Professor> {
    const professor = await this.findOne(id);
    Object.assign(professor, {
      nome_professor: updateProfessorDto.nome ?? professor.nome_professor,
      cpf_professor: updateProfessorDto.cpf ?? professor.cpf_professor,
      email_professor: updateProfessorDto.email ?? professor.email_professor,
      telefone_professor: updateProfessorDto.telefone ?? professor.telefone_professor,
    });
    return this.professorRepository.save(professor);
  }

  async remove(id: number): Promise<void> {
    const professor = await this.findOne(id);
    await this.professorRepository.remove(professor);
  }
}
