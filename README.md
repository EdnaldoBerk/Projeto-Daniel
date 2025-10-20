# Projeto BookReviews

Este é um site de reviews de livros onde os usuários podem compartilhar e discutir suas resenhas literárias.

## Estrutura do Projeto

- `frontend/`: Contém os arquivos do cliente web (Vite)
  - `index.html`: Página principal
  - `styles/`: Arquivos CSS
  - `js/`: Arquivos JavaScript
  - `assets/`: Imagens e outros recursos

- `backend/`: Contém os arquivos do servidor
  - `src/`: Código fonte do servidor
  - `package.json`: Dependências do projeto

## Tecnologias Utilizadas

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (Vanilla, com planos futuros para React)
  - Vite (Bundler e Dev Server)

- Backend:
  - Node.js
  - Express
  - PostgreSQL

## Como Iniciar o Projeto

### Instalação
1. Clone o repositório
2. Na raiz do projeto, execute:
```bash
npm run install-all
```
Este comando instalará todas as dependências necessárias para o frontend e backend.

### Desenvolvimento
Para iniciar o ambiente de desenvolvimento:
```bash
npm run dev
```
- Frontend estará disponível em: http://localhost:3000
- Backend estará disponível em: http://localhost:5000

### Produção
Para iniciar em modo produção:
```bash
npm start
```

## Funcionalidades Planejadas

- [x] Layout responsivo
- [x] Barra de pesquisa
- [x] Sistema de filtros
- [ ] Sistema de login
- [ ] Sistema de comentários
- [ ] Integração com banco de dados
- [ ] Sistema de avaliação
- [ ] Perfis de usuário
