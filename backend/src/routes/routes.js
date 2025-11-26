const { Router } = require('express');
const { registrarUsuario, logarUsuario, logarAdmin, obterUsuarioPorEmail } = require('../controllers/controller');

const router = Router();

router.post('/registro', registrarUsuario);
router.post('/login', logarUsuario);
router.post('/admin/login', logarAdmin);
router.get('/usuario/:email', obterUsuarioPorEmail);

module.exports = router;
