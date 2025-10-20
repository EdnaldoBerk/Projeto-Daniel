const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importação das rotas
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

// Configuração do dotenv
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do BookReviews!' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Porta do servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});