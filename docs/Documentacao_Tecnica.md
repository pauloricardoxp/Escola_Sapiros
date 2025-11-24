# 📚 Documentação Técnica — Escola Sapiros
**Versão:** 2.0  
**Data:** Novembro/2025  

---

## 📑 Sumário
1. [Introdução](#1️⃣-introdução)  
   1.1 [Convenções, Termos e Abreviações](#11-🔤-convenções-terminos-e-abreviações)  
   1.2 [Identificação e Importância dos Requisitos](#12-📝-identificação-e-importância-dos-requisitos)  
2. [Panorama Geral do Sistema](#2️⃣-panorama-geral-do-sistema)  
   2.1 [Problema Identificado](#21-❌-problema-identificado)  
   2.2 [Solução Proposta](#22-💡-solução-proposta)  
   2.3 [Personas](#23-👥-personas)  
3. [Requisitos Funcionais (RF)](#3️⃣-requisitos-funcionais-rf)  
4. [Requisitos Não Funcionais (RNF)](#4️⃣-requisitos-não-funcionais-rnf)  
5. [Requisitos de Negócio (RN)](#5️⃣-requisitos-de-negócio-rn)  
6. [Arquitetura Técnica](#6️⃣-arquitetura-técnica)  
   6.1 [Tecnologias](#61-tecnologias)  
   6.2 [Estrutura de Pastas](#62-estrutura-de-pastas)  
7. [Roadmap de Evolução](#7️⃣-roadmap-de-evolução)  
8. [Segurança e Privacidade](#8️⃣-segurança-e-privacidade)  
9. [Conclusão](#9️⃣-conclusão)  

---

## 1️⃣ Introdução
Este documento descreve os requisitos funcionais e não funcionais do sistema **Escola Sapiros**, uma aplicação web para gerenciamento de processos escolares, incluindo matrícula, turmas, notas, presenças, emissão de documentos, comunicação e integração com IA escolar.

### 1.1 🔤 Convenções, Termos e Abreviações
| Termo | Definição |
|-------|-----------|
| Backup | Cópia reserva dos dados importantes |
| CRUD | Criar, Ler, Atualizar, Deletar |
| CSV | Importação por planilha |
| Dashboard | Painel visual de métricas e indicadores |
| Endpoint | Ponto final de acesso a informações de outro sistema |
| Hash | Código único e irreversível para proteger dados |
| IA | Inteligência Artificial |
| IMP | Nível de importância do requisito |
| INEP | Órgão de avaliação da educação no Brasil |
| LDB | Lei de Diretrizes e Bases da Educação Nacional |
| Logs | Registro de atividades do sistema |
| PDF | Formato de documento que mantém a formatação |
| Personas | Representação semi-fictícia do cliente ideal |
| QR Code | Código de barras em quadrados legível por celular |
| RBAC | Controle de Acesso Baseado em Função |
| Roadmap | Programa de metas de desenvolvimento |
| SEDUC | Secretaria de Educação |
| WCAG | Diretrizes de acessibilidade web |

### 1.2 📝 Identificação e Importância dos Requisitos
- Cada requisito possui **ID único**: RF001, RNF001 ou RN001.  
- **Níveis de importância:**  
  - 🔴 Alta: requisito essencial para funcionamento.  
  - 🟡 Média: agrega valor, mas não impede o uso básico.  
  - 🟢 Baixa: melhorias ou funcionalidades de nicho.

---

## 2️⃣ Panorama Geral do Sistema
**Escola Sapiros** centraliza e automatiza atividades administrativas e pedagógicas para escolas de pequeno e médio porte, incluindo:  
- 🏫 Cadastro e matrícula de alunos  
- 👩‍🏫 Cadastro de professores, disciplinas e turmas  
- 📝 Lançamento e acompanhamento de notas e presenças  
- 📄 Emissão de boletins, históricos e declarações em PDF com QR Code  
- 📢 Comunicação com responsáveis via mural de avisos  
- 🔐 Gestão de perfis de acesso (RBAC)  
- 📅 Calendário escolar com eventos e provas  
- 🤖 Integração com IA escolar e MentorEduIA  
- 📊 Relatórios analíticos de faltas, médias e evolução anual  

### 2.1 ❌ Problema Identificado
Muitas escolas usam planilhas e processos manuais, causando erros, retrabalho e dificuldade de conformidade legal.

### 2.2 💡 Solução Proposta
Centralizar todas as demandas em uma plataforma única, garantindo segurança, transparência e integração futura com órgãos educacionais e IA.

### 2.3 👥 Personas
| Persona | Responsabilidades |
|---------|-----------------|
| Secretaria Escolar | Emissão de documentos, matrícula, buscas rápidas com IA |
| Coordenação/Direção | Consolidação de notas e faltas, análise de dashboards |
| Professor | Lançamento de notas e presenças, integração com MentorEduIA |
| Responsável/Aluno | Consulta de boletins, históricos, avisos e calendário |
| Mantenedora/Órgão de Controle | Exportação de dados e conformidade legal |

---

## 3️⃣ Requisitos Funcionais (RF)
| ID | Nome | Descrição | IMP |
|----|------|-----------|-----|
| RF001 | Autenticação de Usuário | Login com e-mail/CPF e senha | 🔴 Alta |
| RF002 | Perfis e Níveis de Acesso (RBAC) | Permissões específicas por perfil | 🔴 Alta |
| RF003 | Cadastro de Alunos | Cadastro de alunos com dados pessoais e acadêmicos | 🔴 Alta |
| RF004 | Cadastro de Responsáveis | Cadastro e vínculo com alunos | 🔴 Alta |
| RF005 | Cadastro de Turmas | Criação de turmas com professores, disciplinas e horários | 🔴 Alta |
| RF006 | Cadastro de Disciplinas | Criação de disciplinas com nome, área e série | 🔴 Alta |
| RF007 | Parâmetros Pedagógicos | Configuração de etapas, notas, pesos, frequência | 🔴 Alta |
| RF008 | Lançamento de Notas | Registro de notas por disciplina, etapa e aluno | 🔴 Alta |
| RF009 | Lançamento de Faltas | Registro de presença/faltas por aula e aluno | 🔴 Alta |
| RF010 | Consolidação de Período | Cálculo de médias finais e bloqueio de edição | 🔴 Alta |
| RF011 | Emissão de Boletim PDF | Boletim escolar em PDF com QR Code | 🔴 Alta |
| RF012 | Emissão de Histórico Escolar | Histórico completo com séries e disciplinas | 🔴 Alta |
| RF013 | QR Code de Verificação | QR Code em cada documento oficial | 🔴 Alta |
| RF014 | Emissão de Declarações | Declarações de matrícula, frequência e administrativas | 🟡 Média |
| RF015 | Mural de Avisos | Publicação de avisos para alunos e responsáveis | 🟡 Média |
| RF016 | Calendário Escolar | Exibição de calendário com eventos e provas | 🟡 Média |
| RF017 | Relatórios Gerais | Relatórios de notas, presenças e desempenho | 🟡 Média |
| RF018 | Dashboards | Painéis de indicadores por perfil | 🟡 Média |
| RF019 | Solicitação de Documentos | Solicitação e gestão de documentos | 🟡 Média |
| RF020 | Logs de Alterações | Registro de alterações críticas | 🔴 Alta |
| RF021 | IA Mínima para Comandos Simples | Interpretação de comandos de usuários | 🟡 Média |

---

## 4️⃣ Requisitos Não Funcionais (RNF)
| ID | Nome | Descrição | IMP |
|----|------|-----------|-----|
| RNF001 | Autenticação de usuários | Senhas ≥8 caracteres, atualização a cada 90 dias, hash | 🔴 Alta |
| RNF002 | Controle de acesso | Bloqueio após 5 tentativas falhas | 🔴 Alta |
| RNF003 | Integridade dos documentos | PDFs gerados com QR Code em <5s | 🔴 Alta |
| RNF004 | Responsividade | Chrome, Edge, Firefox e mobile | 🔴 Alta |
| RNF005 | Interface amigável | Principais ações ≤3 cliques | 🟡 Média |
| RNF006 | Acessibilidade | WCAG 2.1 Nível AA | 🟡 Média |
| RNF007 | Backup automático | Backup diário do banco de dados | 🔴 Alta |
| RNF008 | Manutenibilidade/Versionamento | Atualizações sem interrupção >15min, crescimento modular | 🟡 Média |
| RNF009 | Tempo de resposta | Operações ≤3s; emissão <5s | 🟡 Média |
| RNF010 | Acesso contínuo | Disponibilidade ≥99% | 🔴 Alta |
| RNF011 | Privacidade e Logs | RBAC rigoroso, registro de ações críticas | 🔴 Alta |
| RNF012 | Testes e Indicadores | Cobertura de testes >80%, redução de erros >50% | 🟡 Média |

---

## 5️⃣ Requisitos de Negócio (RN)
| ID | Nome | Definição |
|----|------|-----------|
| RN001 | Conformidade Legal | Atender LDB, SEDUC e INEP |
| RN002 | Eficiência da Secretaria | Reduzir emissão de documentos para <5min |
| RN003 | Regra de Aprovação | Aplicar regras de aprovação/reprovação automaticamente |
| RN004 | Integridade e Imutabilidade | Garantir unicidade de IDs e imutabilidade de dados após consolidação |
| RN005 | Transparência e Comunicação | Canal seguro e rastreável para avisos |
| RN006 | IA como Assistente | IA simplifica tarefas sem substituir humanos |
| RN007 | Indicadores de Sucesso | Emissão rápida, eliminação de planilhas, satisfação >80% |

---

## 6️⃣ Arquitetura Técnica

### 6.1 Tecnologias
- ⚛️ React + Vite  
- 📝 TypeScript  
- 🗂 Zustand/Context  
- 🔗 Axios  
- 🔀 React Router  
- 🎨 TailwindCSS  

### 6.2 Estrutura de Pastas
```text
src/
├─ api/
├─ components/
├─ pages/
├─ store/
├─ hooks/
├─ utils/
└─ styles/
```


## 7️⃣ Roadmap de Evolução
O desenvolvimento do sistema será feito em fases, seguindo a filosofia de crescimento modular: MVP primeiro, depois expansões.

- **Fase 1** – Funcionalidades essenciais
  - Painéis avançados
  - Notificações
  - Logs completos

- **Fase 2** – IA avançada
  - Integração com MentorEduIA
  - Geração de atividades e exercícios personalizados

- **Fase 3** – Expansão mobile
  - Aplicativo mobile
  - Push notifications

---

## 8️⃣ Segurança e Privacidade
O sistema seguirá boas práticas de segurança e proteção de dados:

- 🔐 **Tratamento mínimo de dados**: coleta apenas o necessário para operação do sistema  
- 🔑 **Criptografia de senhas**: armazenamento seguro usando hash irreversível  
- 📄 **QR seguro**: cada documento oficial terá QR Code de verificação  
- 🛡 **Controle de acesso rígido**: permissões definidas por RBAC  
- 📝 **Logs de acesso**: registro de todas as ações críticas para auditoria  
- ✅ **Consentimento informado**: comunicação clara sobre coleta e uso de dados  
- 👥 **Papéis RBAC**: definição de perfis e permissões específicas

---

## 9️⃣ Conclusão
A versão final da documentação **Escola Sapiros** integra:

- 📄 Documento original completo  
- 🛠 Acréscimos técnicos profissionais, incluindo IA mínima  
- 🤖 Integração com IA escolar e MentorEduIA para tutoria personalizada  
- 🏗 Arquitetura clara e detalhada  
- 📈 Roadmap evolutivo, destacando fases de implementação e expansão  
- 🔒 Segurança e privacidade alinhadas às melhores práticas  

O documento serve como referência para desenvolvimento, implementação e manutenção do sistema, garantindo **conformidade legal, eficiência operacional e experiência positiva para todos os usuários**.
