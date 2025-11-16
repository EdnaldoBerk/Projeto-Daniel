const { Router } = require('express');
const { registrarUsuario, logarUsuario, obterUsuarioPorEmail } = require('../controllers/controller');

const router = Router();

router.post('/registro', registrarUsuario);
router.post('/login', logarUsuario);
router.get('/usuario/:email', obterUsuarioPorEmail);

module.exports = router;
