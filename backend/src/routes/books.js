const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Listar todos os livros
router.get('/', bookController.getAllBooks);

// Buscar um livro específico
router.get('/:id', bookController.getBookById);

// Buscar livros por gênero
router.get('/genre/:genre', bookController.getBooksByGenre);

// Buscar livros por termo de pesquisa
router.get('/search/:query', bookController.searchBooks);

// Adicionar um novo livro (requer autenticação)
router.post('/', bookController.createBook);

// Atualizar um livro (requer autenticação)
router.put('/:id', bookController.updateBook);

// Deletar um livro (requer autenticação)
router.delete('/:id', bookController.deleteBook);

module.exports = router;