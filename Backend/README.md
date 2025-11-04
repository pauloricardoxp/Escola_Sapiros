# Backend - Escola 

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MySQL instalado e rodando
- NestJS CLI instalado globalmente: `npm install -g @nestjs/cli`

### Dependências principais
@nestjs/typeorm, typeorm, mysql2, @nestjs/config, bcrypt, class-validator, class-transformer


# Instale as dependências
npm install

# Configure o .env (baseado no .env.exemplo)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha
DB_NAME=escola

# Rode o servidor em modo desenvolvimento
npm run start:dev
