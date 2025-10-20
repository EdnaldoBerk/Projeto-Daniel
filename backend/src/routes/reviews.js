const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Listar todas as reviews de um livro
router.get('/book/:bookId', reviewController.getBookReviews);

// Obter uma review específica
router.get('/:id', reviewController.getReviewById);

// Criar uma nova review
router.post('/', reviewController.createReview);

// Atualizar uma review
router.put('/:id', reviewController.updateReview);

// Deletar uma review
router.delete('/:id', reviewController.deleteReview);

// Adicionar comentário em uma review
router.post('/:id/comments', reviewController.addComment);

// Listar comentários de uma review
router.get('/:id/comments', reviewController.getReviewComments);

// Dar like em uma review
router.post('/:id/like', reviewController.likeReview);

// Remover like de uma review
router.delete('/:id/like', reviewController.unlikeReview);

module.exports = router;