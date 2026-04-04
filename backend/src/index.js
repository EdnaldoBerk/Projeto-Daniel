const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const routes = require('./routes/routes');

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);

app.use((err, req, res, next) => {
  if (!err) return next();

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Arquivo muito grande. O tamanho máximo é 5MB.' });
  }

  if (err.message && err.message.includes('Apenas imagens são permitidas')) {
    return res.status(400).json({ error: err.message });
  }

  console.error('Erro não tratado:', err);
  return res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend ouvindo na porta ${PORT}`);
});
