# Exemplos de Uso da API

## Autenticação

### Registro de Novo Usuário
```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "role": "athlete"
}
```

### Login
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "athlete@gmail.com",
  "password": "athlete123"
}
```

## Treinos

### Criar Treino (Treinador)
```bash
POST http://localhost:3000/workouts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Treino de Peito e Tríceps",
  "description": "Treino focado em força para peitoral e tríceps",
  "duration": "60 min",
  "restTime": "90s",
  "difficulty": "intermediate",
  "category": "Força",
  "exercises": [
    {
      "name": "Supino Reto",
      "sets": 4,
      "reps": "8-10",
      "rest": "90s"
    },
    {
      "name": "Supino Inclinado",
      "sets": 3,
      "reps": "10-12",
      "rest": "60s"
    }
  ],
  "assignedTo": ["<athlete_id>"],
  "scheduledDate": "2025-10-20T10:00:00Z"
}
```

### Listar Treinos
```bash
GET http://localhost:3000/workouts
Authorization: Bearer <token>
```

### Marcar Treino como Completo
```bash
PATCH http://localhost:3000/workouts/<workout_id>/complete
Authorization: Bearer <token>
```

## Exercícios

### Criar Exercício Customizado
```bash
POST http://localhost:3000/exercises
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Flexão Diamante",
  "description": "Variação de flexão focada em tríceps",
  "category": "Força",
  "difficulty": "intermediate",
  "muscleGroups": ["Tríceps", "Peitoral"],
  "equipment": "Nenhum",
  "instructions": [
    "Posicione as mãos próximas formando um diamante",
    "Desça controladamente",
    "Empurre para cima"
  ],
  "isCustom": true
}
```

### Listar Exercícios
```bash
GET http://localhost:3000/exercises
```

### Buscar por Categoria
```bash
GET http://localhost:3000/exercises/category/Força
```

## Metas

### Criar Meta
```bash
POST http://localhost:3000/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Aumentar Supino para 100kg",
  "description": "Meta de força para o próximo trimestre",
  "category": "strength",
  "priority": "high",
  "target": 100,
  "current": 80,
  "unit": "kg",
  "targetDate": "2025-12-31"
}
```

### Listar Metas
```bash
GET http://localhost:3000/goals
Authorization: Bearer <token>
```

### Atualizar Progresso
```bash
PATCH http://localhost:3000/goals/<goal_id>/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "current": 85
}
```

## Analytics

### Estatísticas do Usuário
```bash
GET http://localhost:3000/analytics/stats
Authorization: Bearer <token>
```

### Tendências de Treinos
```bash
GET http://localhost:3000/analytics/trends?days=30
Authorization: Bearer <token>
```

### Progresso das Metas
```bash
GET http://localhost:3000/analytics/goals/progress
Authorization: Bearer <token>
```

### Distribuição por Categoria
```bash
GET http://localhost:3000/analytics/categories
Authorization: Bearer <token>
```

## Health Check

### Status da API
```bash
GET http://localhost:3000/health
```

### Status do Banco de Dados
```bash
GET http://localhost:3000/health/db
```

## Usuários

### Obter Perfil
```bash
GET http://localhost:3000/users/profile
Authorization: Bearer <token>
```

### Atualizar Perfil
```bash
PATCH http://localhost:3000/users/<user_id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "weight": 78,
  "height": 180,
  "bio": "Atleta focado em hipertrofia"
}
```

### Listar Atletas (Treinador)
```bash
GET http://localhost:3000/users/trainer/<trainer_id>/athletes
Authorization: Bearer <token>
```