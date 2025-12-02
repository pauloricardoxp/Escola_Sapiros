import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, In, DataSource } from 'typeorm'; // Adicionamos DataSource
import * as bcrypt from 'bcrypt';

import { Aluno } from './entities/aluno.entity';
import { Usuario, Role } from '../usuario/entities/usuario.entity'; // Importamos Usuario
import { Turma } from '../turma/entities/turma.entity';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';

// Função para garantir que uma data seja válida ou lança exceção (para campos NOT NULL)
const parseDate = (value: string | Date, fieldName: string): Date => {
  if (value instanceof Date) {
    return value;
  }
  
  const d = new Date(value);
  
  if (isNaN(d.getTime())) {
    throw new ConflictException(`${fieldName} inválida: "${value}"`);
  }
  
  return d;
};

// Função para lidar com datas opcionais (para campos nullable: true)
const parseOptionalDate = (value?: string | Date): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
};

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(Aluno)
    private alunoRepository: Repository<Aluno>,
    
    @InjectRepository(Usuario) // 🔑 OBRIGATÓRIO para JTI Manual
    private usuarioRepository: Repository<Usuario>,

    @InjectRepository(Turma)
    private turmaRepository: Repository<Turma>,
    
    private dataSource: DataSource, // Injetar DataSource para transações
  ) {}

  async create(createAlunoDto: CreateAlunoDto): Promise<Aluno> {
    // 1. VALIDAÇÕES: Usando o relacionamento 'usuario' para buscar CPF/Email/Telefone
    
    if (await this.alunoRepository.findOne({ 
      where: { usuario: { cpf: createAlunoDto.cpf } } 
    })) {
      throw new ConflictException('CPF já cadastrado');
    }
    
    if (createAlunoDto.email && await this.alunoRepository.findOne({ 
      where: { usuario: { email: createAlunoDto.email } } 
    })) {
      throw new ConflictException('Email já cadastrado');
    }
    
    if (createAlunoDto.telefone && await this.alunoRepository.findOne({ 
      where: { usuario: { telefone: createAlunoDto.telefone } } 
    })) {
      throw new ConflictException('Telefone já cadastrado');
    }

    // 2. CRIAÇÃO SEGURA COM TRANSAÇÃO
    
    return this.dataSource.transaction(async (manager) => {
      // 2a. Preparar dados do USUÁRIO (Base)
      const userData: DeepPartial<Usuario> = {
        nome: createAlunoDto.nome,
        email: createAlunoDto.email,
        cpf: createAlunoDto.cpf,
        telefone: createAlunoDto.telefone,
        senha: await bcrypt.hash(createAlunoDto.senha, 10),
        data_nascimento: parseDate(createAlunoDto.data_nascimento, 'Data de Nascimento'),
        sexo: createAlunoDto.sexo,
        rgNumero: createAlunoDto.rgNumero,
        rgDataEmissao: parseOptionalDate(createAlunoDto.rgDataEmissao),
        rgOrgaoEmissor: createAlunoDto.rgOrgaoEmissor,
        enderecoLogradouro: createAlunoDto.enderecoLogradouro,
        enderecoNumero: createAlunoDto.enderecoNumero,
        enderecoCep: createAlunoDto.enderecoCep,
        enderecoComplemento: createAlunoDto.enderecoComplemento,
        enderecoBairro: createAlunoDto.enderecoBairro,
        enderecoEstado: createAlunoDto.enderecoEstado,
        enderecoCidade: createAlunoDto.enderecoCidade,
        nacionalidade: createAlunoDto.nacionalidade,
        naturalidade: createAlunoDto.naturalidade,
        possuiNecessidadesEspeciais: createAlunoDto.possuiNecessidadesEspeciais || false,
        descricaoNecessidadesEspeciais: createAlunoDto.descricaoNecessidadesEspeciais,
        possuiAlergias: createAlunoDto.possuiAlergias || false,
        descricaoAlergias: createAlunoDto.descricaoAlergias,
        autorizacaoUsoImagem: createAlunoDto.autorizacaoUsoImagem || false,
        role: Role.ALUNO, // Define o papel na tabela base
      };

      const novoUsuario = manager.create(Usuario, userData);
      const usuarioSalvo = await manager.save(Usuario, novoUsuario);

      // 2b. Preparar dados do ALUNO (Específico)
      const alunoData: DeepPartial<Aluno> = {
        // 🔑 Chaves do JTI Manual: Usa o ID do usuário como FK/PK do aluno
        id: usuarioSalvo.id,
        usuario: usuarioSalvo, 

        matricula_aluno: await this.generateMatricula(),
        serieAno: createAlunoDto.serieAno,
        escolaOrigem: createAlunoDto.escolaOrigem,
        responsavelNome: createAlunoDto.responsavelNome,
        responsavel_Data_Nascimento: parseOptionalDate(createAlunoDto.responsavel_Data_Nascimento),
        responsavel_sexo: createAlunoDto.responsavel_sexo || 'NAO_INFORMADO',
        responsavel_nacionalidade: createAlunoDto.responsavel_nacionalidade,
        responsavel_naturalidade: createAlunoDto.responsavel_naturalidade,
        responsavelCpf: createAlunoDto.responsavelCpf,
        responsavelRg: createAlunoDto.responsavelRg,
        responsavel_rg_OrgaoEmissor: createAlunoDto.responsavel_rg_OrgaoEmissor,
        responsavelTelefone: createAlunoDto.responsavelTelefone,
        responsavelEmail: createAlunoDto.responsavelEmail,
        responsavelCep: createAlunoDto.responsavelCep,
        responsavelLogradouro: createAlunoDto.responsavelLogradouro,
        responsavelNumero: createAlunoDto.responsavelNumero,
        responsavelComplemento: createAlunoDto.responsavelComplemento,
        responsavelBairro: createAlunoDto.responsavelBairro,
        responsavelCidade: createAlunoDto.responsavelCidade,
        responsavelEstado: createAlunoDto.responsavelEstado,
      };

      const novoAluno = manager.create(Aluno, alunoData);
      
      // 2c. Associar turmas (usando manager para a transação)
      if (createAlunoDto.turmasIds?.length) {
        const turmas = await manager.findBy(Turma, { id_turma: In(createAlunoDto.turmasIds) });
        novoAluno.turmas = turmas;
      }

      return await manager.save(Aluno, novoAluno);
    });
  }

  async findAll(): Promise<Aluno[]> {
    // Carrega a relação 'usuario' para ter acesso a nome, cpf, etc.
    return await this.alunoRepository.find({ relations: ['usuario', 'turmas'] });
  }

  async findOne(id: string): Promise<Aluno> {
    const aluno = await this.alunoRepository.findOne({ 
      where: { id }, 
      relations: ['usuario', 'turmas'] 
    });
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return aluno;
  }

  async update(id: string, dto: UpdateAlunoDto): Promise<Aluno> {
    // Busca o aluno e o usuário relacionado
    const aluno = await this.findOne(id);
    const usuario = aluno.usuario; // Acessa o objeto Usuario

    if (!usuario) throw new NotFoundException('Usuário base não encontrado.');
    
    // Atualizar campos do USUARIO (tabela 'usuarios')
    if (dto.nome) usuario.nome = dto.nome;
    if (dto.telefone) usuario.telefone = dto.telefone;
    
    if (dto.data_nascimento) {
      usuario.data_nascimento = parseDate(dto.data_nascimento, 'Data de Nascimento');
    }
    
    // Atualizar campos do ALUNO (tabela 'alunos')
    // Exemplo: if (dto.serieAno) aluno.serieAno = dto.serieAno;
    
    // Salva as alterações no usuário e no aluno
    await this.usuarioRepository.save(usuario);
    return await this.alunoRepository.save(aluno);
  }

  async remove(id: string): Promise<void> {
    const aluno = await this.findOne(id);
    
    // Deletar o registro de Aluno (tabela 'alunos')
    await this.alunoRepository.remove(aluno); 
    
    // O onDelete: 'CASCADE' na entidade Aluno deve remover o Usuario, 
    // mas salvamos o delete explícito para garantir em caso de falha de CASCADE
    await this.usuarioRepository.delete(id);
  }

  async generateMatricula(): Promise<string> {
    const now = new Date();
    const ano = now.getFullYear().toString();
    const mes = (now.getMonth() + 1).toString().padStart(2, '0');

    const ultimaMatricula = await this.alunoRepository
      .createQueryBuilder('aluno')
      .where("aluno.matricula_aluno LIKE :prefix", { prefix: `${ano}${mes}%` })
      .orderBy('aluno.matricula_aluno', 'DESC')
      .getOne();

    let sequencia = 1;
    if (ultimaMatricula) {
      const ultimaSeq = parseInt(ultimaMatricula.matricula_aluno.slice(6, 9));
      sequencia = ultimaSeq + 1;
    }

    return `${ano}${mes}${sequencia.toString().padStart(3, '0')}`;
  }
}