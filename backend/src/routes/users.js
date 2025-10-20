const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registro de usuário
router.post('/register', userController.register);

// Login de usuário
router.post('/login', userController.login);

// Obter perfil do usuário
router.get('/profile', userController.getProfile);

// Atualizar perfil do usuário
router.put('/profile', userController.updateProfile);

// Listar reviews do usuário
router.get('/reviews', userController.getUserReviews);

// Listar livros favoritos do usuário
router.get('/favorites', userController.getFavoriteBooks);

// Adicionar livro aos favoritos
router.post('/favorites/:bookId', userController.addToFavorites);

// Remover livro dos favoritos
router.delete('/favorites/:bookId', userController.removeFromFavorites);

module.exports = router;