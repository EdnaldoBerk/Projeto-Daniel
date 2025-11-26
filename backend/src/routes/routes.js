const { Router } = require('express');
const { registrarUsuario, logarUsuario, logarAdmin, obterUsuarioPorEmail, listarUsuarios, buscarUsuarioPorId, atualizarUsuario, deletarUsuario } = require('../controllers/controller');

const router = Router();

router.post('/registro', registrarUsuario);
router.post('/login', logarUsuario);
router.post('/admin/login', logarAdmin);
router.get('/usuario/:email', obterUsuarioPorEmail);

// Rotas de administração de usuários
router.get('/admin/usuarios', listarUsuarios);
router.get('/admin/usuarios/:id', buscarUsuarioPorId);
router.put('/admin/usuarios/:id', atualizarUsuario);
router.delete('/admin/usuarios/:id', deletarUsuario);

module.exports = router;
