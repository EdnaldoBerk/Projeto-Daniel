const { Router } = require('express');
const { registrarUsuario, logarUsuario, logarAdmin, obterUsuarioPorEmail, listarUsuarios, buscarUsuarioPorId, atualizarUsuario, deletarUsuario, criarLivro, listarLivros, buscarLivroPorId, atualizarLivro, deletarLivro } = require('../controllers/controller');
const upload = require('../config/multer');

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

// Rotas de administração de livros
router.post('/admin/livros', upload.fields([{ name: 'fotoCapa', maxCount: 1 }, { name: 'galeria', maxCount: 10 }]), criarLivro);
router.get('/admin/livros', listarLivros);
router.get('/admin/livros/:id', buscarLivroPorId);
router.put('/admin/livros/:id', upload.fields([{ name: 'fotoCapa', maxCount: 1 }, { name: 'galeria', maxCount: 10 }]), atualizarLivro);
router.delete('/admin/livros/:id', deletarLivro);

module.exports = router;
