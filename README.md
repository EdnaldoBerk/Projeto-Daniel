# Estante Aberta

Plataforma web para compartilhamento e descoberta de livros e resenhas.

## 🚀 Tecnologias

### Frontend
- React + Vite
- React Router
- CSS Modules

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [PostgreSQL](https://www.postgresql.org/download/) (versão 12 ou superior)
- Git

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/EdnaldoBerk/Projeto-Daniel.git
cd Projeto-Daniel
```

### 2. Instale as dependências

Na raiz do projeto, execute:

```bash
npm install
```

Este comando instalará automaticamente as dependências do backend e frontend.

### 3. Configure o Banco de Dados

Execute as migrações do Prisma:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

**Nota:** O arquivo `.env` já está configurado no repositório com as credenciais padrão.

## ▶️ Executando o Projeto

### Iniciar o Backend

No terminal da pasta `backend`:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### Iniciar o Frontend

No terminal da pasta `frontend`:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
Projeto-Daniel/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── prisma/
│   │   └── index.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── header/
    │   │   ├── footer/
    │   │   ├── cardbook/
    │   │   ├── slider/
    │   │   └── profile/
    │   ├── pages/
    │   │   ├── PgLogin.jsx
    │   │   ├── PgCadastro.jsx
    │   │   └── PgResenha.jsx
    │   ├── services/
    │   ├── styles/
    │   └── App.jsx
    └── package.json
```

## 🎨 Paleta de Cores

O projeto utiliza um tema escuro (Dark Mode) com a seguinte paleta:

- **Accent/Principal**: `#646cff`
- **Background**: `#1a1a1a` / `#242424`
- **Texto**: `#ffffff`
- **Texto Secundário**: `#b0b0b0`
- **Bordas**: `#2f2f3a`

## 🔑 Funcionalidades Principais

- ✅ Sistema de autenticação (Login/Cadastro)
- ✅ Perfil de usuário com dropdown
- ✅ Catálogo de livros com slider
- ✅ Página de resenhas detalhadas
- ✅ Sistema de comentários
- ✅ Busca e filtros
- ✅ Layout responsivo

## 🛠️ Scripts Úteis

### Backend
```bash
npm run dev          # Inicia servidor em modo desenvolvimento
npx prisma studio    # Abre interface visual do banco
npx prisma migrate   # Cria nova migração
```

### Frontend
```bash
npm run dev          # Inicia aplicação em modo desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção
```

## 📝 Notas Importantes

1. **Banco de Dados**: Certifique-se de que o PostgreSQL está rodando antes de iniciar o backend
2. **Portas**: Backend usa porta 3001, Frontend usa porta 5173
3. **CORS**: O backend já está configurado para aceitar requisições do frontend

## 🤝 Equipe

- Ednaldo Oliveira
- Hugo Davi
- Lisa
- Alonso

## 📄 Licença

Este projeto é privado e de uso acadêmico.
