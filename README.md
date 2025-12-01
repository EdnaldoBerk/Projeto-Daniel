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

Crie o banco de dados PostgreSQL:

```bash
# Acesse o PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE "EstanteAberta";
```

Execute as migrações do Prisma:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

**Nota:** O arquivo `.env` já está configurado no repositório com as credenciais padrão. Ajuste se necessário:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/EstanteAberta"
ADMIN_ACCESS_KEY="projeto-daniel"
```

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

O frontend está configurado para rodar em `http://localhost:3000` (ver `vite.config.js`).

### Executar tudo em um único comando (raiz)

Na raiz do projeto você também pode usar:

```bash
npm run dev
```

Esse script utiliza `concurrently` para subir backend (porta 3001) e frontend (porta 3000) juntos.

## 📁 Estrutura do Projeto

```
Projeto-Daniel/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── multer.js          # Configuração de upload
│   │   ├── controllers/
│   │   │   └── controller.js      # Lógica de controle
│   │   ├── routes/
│   │   │   └── routes.js          # Rotas da API
│   │   ├── services/
│   │   │   └── service.js         # Lógica de negócio
│   │   ├── prisma/
│   │   │   ├── schema.prisma      # Schema do banco
│   │   │   └── migrations/        # Migrações
│   │   ├── uploads/
│   │   │   ├── books/             # Imagens de livros
│   │   │   └── perfil/            # Fotos de perfil
│   │   └── index.js               # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   │   └── Logo.png
    │   ├── components/
    │   │   ├── header/
    │   │   │   ├── Header.jsx
    │   │   │   └── Header.module.css
    │   │   ├── footer/
    │   │   │   ├── Footer.jsx
    │   │   │   └── Footer.module.css
    │   │   ├── cardbook/
    │   │   │   ├── CardBook.jsx
    │   │   │   └── CardBook.module.css
    │   │   ├── cardreview/
    │   │   │   ├── Cardreview.jsx
    │   │   │   └── Cardreview.module.css
    │   │   ├── slider/
    │   │   │   ├── Slider.jsx
    │   │   │   └── Slider.module.css
    │   │   └── profile/
    │   │       ├── Profile.user.jsx
    │   │       └── Profile.module.css
    │   ├── pages/
    │   │   ├── PgLogin.jsx
    │   │   ├── PgCadastro.jsx
    │   │   ├── PgPerfil.jsx         # Perfil do usuário
    │   │   ├── PgResenha.jsx
    │   │   └── admin/
    │   │       ├── PgAdminLogin.jsx
    │   │       ├── PgAdminDashboard.jsx
    │   │       ├── PgAdminUsers.jsx
    │   │       ├── PgAdminBooks.jsx
    │   │       └── PgAdminResenhas.jsx
    │   ├── services/
    │   │   └── api.js               # Configuração Axios
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── PgLogin.module.css
    │   │   ├── PgCadastro.module.css
    │   │   ├── PgPerfil.module.css
    │   │   ├── PgResenha.module.css
    │   │   └── admin/               # Estilos admin
    │   ├── App.jsx
    │   └── main.jsx
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

### Autenticação e Perfil
- ✅ Sistema de autenticação (Login/Cadastro com validação)
- ✅ Perfil de usuário completo com foto de perfil
- ✅ Edição de dados pessoais (nome, telefone, bio)
- ✅ Sistema de favoritos de livros
- ✅ Alteração de senha
- ✅ Máscaras de formatação (CPF e telefone)

### Administração
- ✅ Painel administrativo completo
- ✅ Gerenciamento de usuários (CRUD)
- ✅ Gerenciamento de livros (CRUD com upload de imagens)
- ✅ Gerenciamento de resenhas
- ✅ Dashboard com estatísticas
- ✅ Sistema de autenticação admin com chave de acesso

### Livros e Conteúdo
- ✅ Catálogo de livros com slider interativo
- ✅ Página de resenhas detalhadas com avaliações
- ✅ Sistema de favoritos por usuário
- ✅ Upload de capa e galeria de imagens dos livros
- ✅ Informações completas (autor, editora, ISBN, sinopse, etc.)

### Interface
- ✅ Header com busca e menu de exploração
- ✅ Sistema de dropdown para navegação
- ✅ Layout responsivo (mobile, tablet, desktop)
- ✅ Tema dark mode moderno
- ✅ Componentes reutilizáveis (CardBook, CardReview, Slider, Profile)
- ✅ Modais para upload e edição
- ✅ Cards de resenhas na página inicial

### Recursos Técnicos
- ✅ Upload de arquivos com Multer (livros e fotos de perfil)
- ✅ Sistema de eventos customizados (userChange, adminChange)
- ✅ Validação de dados no frontend e backend
- ✅ Relacionamentos no banco (favoritos, resenhas)
- ✅ Gerenciamento de estado com localStorage

## 🛠️ Scripts Úteis

### Backend
```bash
npm run dev              # Inicia servidor em modo desenvolvimento
npx prisma studio        # Abre interface visual do banco
npx prisma migrate dev   # Cria e aplica nova migração
npx prisma generate      # Gera cliente Prisma
```

### Frontend
```bash
npm run dev          # Inicia aplicação em modo desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção
```

## 🗄️ Estrutura do Banco de Dados

### Modelos Principais

**Usuario**
- Informações básicas (nome, email, cpf, telefone)
- Foto de perfil e bio
- Sistema de admin (isAdmin)
- Relacionamentos: resenhas, favoritos

**Livro**
- Informações completas (título, autor, editora, ISBN)
- Imagens (fotoCapa, galeria)
- Metadados (ano, páginas, categoria, sinopse)
- Relacionamentos: resenhas, favoritos

**Resenha**
- Conteúdo (título, resumo, texto completo)
- Avaliação (0.0 a 5.0)
- Trechos marcantes (array)
- Curtidas (contador de likes)
- Relacionamentos: livro, usuario

**Favorito**
- Relacionamento muitos-para-muitos entre Usuario e Livro
- Constraint único por usuário/livro

## 📝 Notas Importantes

1. **Banco de Dados**: Certifique-se de que o PostgreSQL está rodando antes de iniciar o backend
2. **Portas**: Backend usa porta 3001, Frontend usa porta 3000
3. **CORS**: O backend já está configurado para aceitar requisições do frontend
4. **Uploads**: As pastas `backend/src/uploads/books` e `backend/src/uploads/perfil` são criadas automaticamente
5. **Admin**: Para acessar o painel admin, use a chave de acesso configurada no `.env`
6. **Máscaras**: CPF e telefone são formatados automaticamente no frontend

## 🔐 Acesso Administrativo

Para criar um usuário admin:

1. Crie um usuário normalmente pelo cadastro
2. Acesse o banco via Prisma Studio: `npx prisma studio`
3. Altere o campo `isAdmin` do usuário para `true`
4. Faça login em `/admin` usando a chave de acesso configurada

## 🎯 Endpoints da API

### Autenticação
- `POST /api/registrar` - Registrar novo usuário
- `POST /api/login` - Login de usuário
- `POST /api/admin/login` - Login administrativo

### Usuários
- `GET /api/admin/usuarios` - Listar todos os usuários
- `GET /api/admin/usuarios/:id` - Buscar usuário por ID
- `PUT /api/admin/usuarios/:id` - Atualizar usuário
- `DELETE /api/admin/usuarios/:id` - Deletar usuário

### Livros
- `GET /api/livros` - Listar todos os livros
- `GET /api/livros/:id` - Buscar livro por ID
- `POST /api/livros` - Criar novo livro (com upload)
- `PUT /api/livros/:id` - Atualizar livro
- `DELETE /api/livros/:id` - Deletar livro

### Resenhas
- `GET /api/resenhas` - Listar todas as resenhas
- `GET /api/resenhas/livro/:livroId` - Resenhas por livro
- `POST /api/resenhas` - Criar nova resenha
- `PUT /api/resenhas/:id` - Atualizar resenha
- `DELETE /api/resenhas/:id` - Deletar resenha

### Favoritos
- `GET /api/favoritos/:usuarioId` - Listar favoritos do usuário
- `POST /api/favoritos` - Adicionar favorito
- `DELETE /api/favoritos/:usuarioId/:livroId` - Remover favorito
- `GET /api/favoritos/check/:usuarioId/:livroId` - Verificar se é favorito

### Upload
- `POST /api/upload/foto-perfil` - Upload de foto de perfil

## 🤝 Equipe

- Ednaldo Oliveira
- Hugo Davi
- Lisa
- Alonso

## 📄 Licença

Este projeto é privado e de uso acadêmico.

