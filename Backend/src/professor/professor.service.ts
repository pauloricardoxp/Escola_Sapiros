import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  /**
   * Cria um professor. Se for passado usuarioId, vincula o usuário (UUID string).
   * Verifica se o usuário existe e se já não está vinculado a outro professor.
   */
  async create(createProfessorDto: CreateProfessorDto): Promise<Professor> {
    const { formacao, usuarioId } = createProfessorDto;

    let usuario: Usuario | undefined;
    if (usuarioId) {
      usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } }) as Usuario | undefined;
      if (!usuario) throw new NotFoundException('Usuário não encontrado');

      const jaVinculado = await this.professorRepository.findOne({
        where: { usuario: usuario },
      });
      if (jaVinculado) {
        throw new BadRequestException('Usuário já está vinculado a outro professor');
      }
    }

    const professor = this.professorRepository.create({
      formacao: formacao ?? undefined,
      usuario,
    });

    return this.professorRepository.save(professor);
  }

  /**
   * Retorna todos os professores com usuário e turmas carregados.
   */
  async findAll(): Promise<Professor[]> {
    return this.professorRepository.find({ relations: ['usuario', 'turmas'] });
  }

  /**
   * Busca um professor por UUID (id_professor).
   */
  async findOne(id: string): Promise<Professor> {
    const professor = await this.professorRepository.findOne({
      where: { id_professor: id },
      relations: ['usuario', 'turmas'],
    });
    if (!professor) throw new NotFoundException('Professor não encontrado');
    return professor;
  }

  /*
   * Atualiza formacao e vinculação de usuário.
   * - Se updateProfessorDto.usuarioId for fornecido e truthy: vincula o usuário (verifica existência e conflito).
   * - Se updateProfessorDto.usuarioId for fornecido e falsy ('' ou null): desvincula o usuário.
   * - Se não for fornecido, mantém vínculo atual.
   */
  async update(id: string, updateProfessorDto: UpdateProfessorDto): Promise<Professor> {
    const professor = await this.findOne(id);

    if (updateProfessorDto.formacao !== undefined) {
      professor.formacao = updateProfessorDto.formacao;
    }

    if (updateProfessorDto.usuarioId !== undefined) {
      const usuarioId = updateProfessorDto.usuarioId;
      if (usuarioId) {
        const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
        if (!usuario) throw new NotFoundException('Usuário não encontrado');

        const existente = await this.professorRepository.findOne({
          where: { usuario: usuario },
        });
        if (existente && existente.id_professor !== professor.id_professor) {
          throw new BadRequestException('Usuário já está vinculado a outro professor');
        }

        professor.usuario = usuario;
      } else {
        // desvincular usuário
        professor.usuario = null;
      }
    }

    return this.professorRepository.save(professor);
  }

 
   // Remove professor por UUID.
  
  async remove(id: string): Promise<void> {
    const professor = await this.findOne(id);
    await this.professorRepository.remove(professor);
  }
}
