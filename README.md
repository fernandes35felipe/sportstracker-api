# Sports Tracker API

API Backend para sistema de acompanhamento esportivo desenvolvida com NestJS, TypeScript e MongoDB.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **Passport** - Middleware de autenticação
- **Bcrypt** - Hash de senhas

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- MongoDB (v6 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone <repository-url>
cd sports-tracker-api
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sports-tracker
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

4. Inicie o MongoDB
```bash
mongod
```

5. Execute a aplicação
```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000`

## 📚 Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/           # Autenticação e autorização
│   ├── users/          # Gerenciamento de usuários
│   ├── workouts/       # Treinos
│   ├── exercises/      # Biblioteca de exercícios
│   ├── goals/          # Metas dos usuários
│   └── analytics/      # Estatísticas e análises
├── app.module.ts       # Módulo raiz
└── main.ts            # Entrada da aplicação
```

## 🔑 Endpoints

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login de usuário
- `POST /auth/validate` - Validar token JWT

### Usuários

- `GET /users` - Listar todos os usuários
- `GET /users/profile` - Obter perfil do usuário logado
- `GET /users/:id` - Obter usuário por ID
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário
- `GET /users/trainer/:trainerId/athletes` - Listar atletas de um treinador

### Treinos

- `POST /workouts` - Criar novo treino
- `GET /workouts` - Listar treinos do usuário
- `GET /workouts/:id` - Obter treino por ID
- `PATCH /workouts/:id` - Atualizar treino
- `DELETE /workouts/:id` - Remover treino
- `PATCH /workouts/:id/complete` - Marcar treino como completo

### Exercícios

- `POST /exercises` - Criar novo exercício
- `GET /exercises` - Listar exercícios
- `GET /exercises/:id` - Obter exercício por ID
- `GET /exercises/category/:category` - Listar exercícios por categoria
- `PATCH /exercises/:id` - Atualizar exercício
- `DELETE /exercises/:id` - Remover exercício

### Metas

- `POST /goals` - Criar nova meta
- `GET /goals` - Listar metas do usuário
- `GET /goals?status=active` - Filtrar metas por status
- `GET /goals/:id` - Obter meta por ID
- `PATCH /goals/:id` - Atualizar meta
- `DELETE /goals/:id` - Remover meta
- `PATCH /goals/:id/progress` - Atualizar progresso da meta

### Analytics

- `GET /analytics/stats` - Estatísticas gerais do usuário
- `GET /analytics/trends?days=30` - Tendências de treinos
- `GET /analytics/goals/progress` - Progresso das metas
- `GET /analytics/categories` - Distribuição por categoria

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Após o login, inclua o token no header das requisições:

```
Authorization: Bearer <seu-token>
```

## 👥 Tipos de Usuário

- **athlete** - Atleta (pode visualizar e completar treinos)
- **trainer** - Treinador (pode criar e atribuir treinos)

## 🧪 Testes

```bash
npm run test
npm run test:watch
npm run test:cov
```

## 📦 Build

```bash
npm run build
npm run start:prod
```

## 🐳 Docker (Opcional)

```bash
docker-compose up -d
```

## 📝 Licença

MIT