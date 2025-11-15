const { Router } = require('express');
const { registrarUsuario, logarUsuario } = require('../controllers/controller');

const router = Router();

router.post('/registro', registrarUsuario);
router.post('/login', logarUsuario);

module.exports = router;
