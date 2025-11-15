const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes/routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend ouvindo na porta ${PORT}`);
});
