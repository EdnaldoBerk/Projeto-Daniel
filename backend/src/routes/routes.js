const { Router } = require('express');
const { registrarUsuario, logarUsuario, logarAdmin, solicitarRecuperacaoSenha, redefinirSenha, obterUsuarioPorEmail, listarUsuarios, buscarUsuarioPorId, atualizarUsuario, deletarUsuario, criarLivro, listarLivros, buscarLivroPorId, atualizarLivro, deletarLivro, criarResenha, listarResenhas, listarResenhasPorLivro, buscarResenhaPorId, atualizarResenha, deletarResenha, adicionarFavorito, removerFavorito, listarFavoritosUsuario, verificarFavorito, salvarLeitura, listarLeiturasUsuario, removerLeituraUsuario, uploadFotoPerfil, curtirResenha, descurtirResenha, verificarCurtidaResenha, avaliarResenha, obterAvaliacaoResenha, criarComentario, listarComentariosResenha, deletarComentario, buscar, listarTodosComentarios, atualizarComentarioAdmin, deletarComentarioAdmin, criarDenuncia, listarDenuncias, atualizarStatusDenunciaCtrl, deletarDenunciaCtrl } = require('../controllers/controller');
const { uploadBooks, uploadPerfil } = require('../config/multer');

const router = Router();

const handleUploadPerfil = (req, res, next) => {
	uploadPerfil.single('fotoPerfil')(req, res, (err) => {
		if (!err) return next();

		if (err.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({ error: 'Arquivo muito grande. O tamanho máximo é 10MB.' });
		}

		if (err.message) {
			return res.status(400).json({ error: err.message });
		}

		return res.status(500).json({ error: 'Erro ao processar upload da imagem' });
	});
};

router.post('/registro', registrarUsuario);
router.post('/login', logarUsuario);
router.post('/admin/login', logarAdmin);
router.post('/auth/forgot-password', solicitarRecuperacaoSenha);
router.post('/auth/reset-password', redefinirSenha);
router.get('/usuario/:email', obterUsuarioPorEmail);

// Rotas de administração de usuários
router.get('/admin/usuarios', listarUsuarios);
router.get('/admin/usuarios/:id', buscarUsuarioPorId);
router.put('/admin/usuarios/:id', atualizarUsuario);
router.delete('/admin/usuarios/:id', deletarUsuario);

// Rotas de administração de livros
router.post('/admin/livros', uploadBooks.fields([{ name: 'fotoCapa', maxCount: 1 }, { name: 'galeria', maxCount: 10 }]), criarLivro);
router.get('/admin/livros', listarLivros);
router.get('/admin/livros/:id', buscarLivroPorId);
router.put('/admin/livros/:id', uploadBooks.fields([{ name: 'fotoCapa', maxCount: 1 }, { name: 'galeria', maxCount: 10 }]), atualizarLivro);
router.delete('/admin/livros/:id', deletarLivro);

// Rotas de resenhas
router.post('/resenhas', criarResenha);
router.get('/resenhas', listarResenhas);
router.get('/resenhas/livro/:livroId', listarResenhasPorLivro);
router.get('/resenhas/:id', buscarResenhaPorId);
router.put('/resenhas/:id', atualizarResenha);
router.delete('/resenhas/:id', deletarResenha);

// Rotas admin de resenhas
router.get('/admin/resenhas', listarResenhas);
router.put('/admin/resenhas/:id', atualizarResenha);
router.delete('/admin/resenhas/:id', deletarResenha);

// Rotas de favoritos
router.post('/favoritos', adicionarFavorito);
router.delete('/favoritos/:usuarioId/:livroId', removerFavorito);
router.get('/favoritos/:usuarioId', listarFavoritosUsuario);
router.get('/favoritos/:usuarioId/:livroId', verificarFavorito);

// Rotas de leituras
router.post('/leituras', salvarLeitura);
router.get('/leituras/:usuarioId', listarLeiturasUsuario);
router.delete('/leituras/:usuarioId/:livroId', removerLeituraUsuario);

// Rota de upload de foto de perfil
router.post('/upload/foto-perfil', handleUploadPerfil, uploadFotoPerfil);

// Rotas de curtidas em resenhas
router.post('/resenhas/:resenhaId/curtir', curtirResenha);
router.delete('/resenhas/:resenhaId/curtir', descurtirResenha);
router.get('/resenhas/:resenhaId/curtir/:usuarioId', verificarCurtidaResenha);
router.post('/resenhas/:resenhaId/avaliacoes', avaliarResenha);
router.get('/resenhas/:resenhaId/avaliacoes', obterAvaliacaoResenha);

// Rotas de comentários
router.post('/comentarios', criarComentario);
router.get('/resenhas/:resenhaId/comentarios', listarComentariosResenha);
router.delete('/comentarios/:comentarioId', deletarComentario);

// Rotas admin de comentários
router.get('/admin/comentarios', listarTodosComentarios);
router.put('/admin/comentarios/:comentarioId', atualizarComentarioAdmin);
router.delete('/admin/comentarios/:comentarioId', deletarComentarioAdmin);

// Rotas de denúncias de comentários
router.post('/denuncias', criarDenuncia);
router.get('/admin/denuncias', listarDenuncias);
router.put('/admin/denuncias/:denunciaId', atualizarStatusDenunciaCtrl);
router.delete('/admin/denuncias/:denunciaId', deletarDenunciaCtrl);

// Busca
router.get('/search', buscar);

module.exports = router;
