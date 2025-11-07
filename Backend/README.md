# Backend - Escola 

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MySQL instalado e rodando
- NestJS CLI instalado globalmente: `npm install -g @nestjs/cli`

### Dependências usadas

npm i @nestjs/typeorm typeorm mysql2
npm i @nestjs/config
npm install bcrypt class-validator class-transformer
npm install -D @types/bcrypt



# Instale as dependências
npm install

# Configuração  de um .env padrão
MYSQL_DB_HOST=localhost
MYSQL_DB_PORT=3306
MYSQL_DB_USER=root
MYSQL_DB_PASSWORD="senha do banco de dados"
MYSQL_DB_NAME="nome do banco de dados"

# Rode o servidor em modo desenvolvimento
npm run start:dev
