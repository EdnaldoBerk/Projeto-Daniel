// Array temporário para simular banco de dados
const reviews = [];

const reviewController = {
    // Listar reviews de um livro
    getBookReviews: async (req, res) => {
        try {
            const { bookId } = req.params;
            const bookReviews = reviews.filter(r => r.bookId === parseInt(bookId));
            res.json(bookReviews);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar reviews' });
        }
    },

    // Buscar review específica
    getReviewById: async (req, res) => {
        try {
            const { id } = req.params;
            const review = reviews.find(r => r.id === parseInt(id));
            
            if (!review) {
                return res.status(404).json({ error: 'Review não encontrada' });
            }

            res.json(review);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar review' });
        }
    },

    // Criar nova review
    createReview: async (req, res) => {
        try {
            const { bookId, userId, content, rating } = req.body;

            // Validação básica
            if (!bookId || !userId || !content || !rating) {
                return res.status(400).json({
                    error: 'BookId, userId, conteúdo e avaliação são obrigatórios'
                });
            }

            const newReview = {
                id: reviews.length + 1,
                bookId: parseInt(bookId),
                userId: parseInt(userId),
                content,
                rating: parseFloat(rating),
                likes: 0,
                comments: [],
                createdAt: new Date()
            };

            reviews.push(newReview);
            res.status(201).json(newReview);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar review' });
        }
    },

    // Atualizar review
    updateReview: async (req, res) => {
        try {
            const { id } = req.params;
            const { content, rating } = req.body;

            const reviewIndex = reviews.findIndex(r => r.id === parseInt(id));
            
            if (reviewIndex === -1) {
                return res.status(404).json({ error: 'Review não encontrada' });
            }

            // Em produção, verificar se o usuário é dono da review

            const updatedReview = {
                ...reviews[reviewIndex],
                content: content || reviews[reviewIndex].content,
                rating: rating || reviews[reviewIndex].rating,
                updatedAt: new Date()
            };

            reviews[reviewIndex] = updatedReview;
            res.json(updatedReview);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar review' });
        }
    },

    // Deletar review
    deleteReview: async (req, res) => {
        try {
            const { id } = req.params;
            const reviewIndex = reviews.findIndex(r => r.id === parseInt(id));
            
            if (reviewIndex === -1) {
                return res.status(404).json({ error: 'Review não encontrada' });
            }

            // Em produção, verificar se o usuário é dono da review

            reviews.splice(reviewIndex, 1);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar review' });
        }
    },

    // Adicionar comentário em uma review
    addComment: async (req, res) => {
        try {
            const { id } = req.params;
            const { userId, content } = req.body;

            const reviewIndex = reviews.findIndex(r => r.id === parseInt(id));
            
            if (reviewIndex === -1) {
                return res.status(404).json({ error: 'Review não encontrada' });
            }

            const newComment = {
                id: reviews[reviewIndex].comments.length + 1,
                userId: parseInt(userId),
                content,
                createdAt: new Date()
            };

            reviews[reviewIndex].comments.push(newComment);
            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar comentário' });
        }
    },

    // Listar comentários de uma review
    getReviewComments: async (req, res) => {
        try {
            const { id } = req.params;
            const review = reviews.find(r => r.id === parseInt(id));
            
            if (!review) {
                return res.status(404).json({ error: 'Review não encontrada' });
            }

            res.json(review.comments);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar comentários' });
        }
    },

    // Dar like em uma review
    likeReview: async (req, res) => {
        try {
            const { id } = req.params;
            const reviewIndex = reviews.findIndex(r => r.id === parseInt(id));
            
            if (reviewIndex === -1) {
                return res.status(404).json({ error: 'Review não encontrada' });
            }

            reviews[reviewIndex].likes += 1;
            res.json({ likes: reviews[reviewIndex].likes });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao dar like' });
        }
    },

    // Remover like de uma review
    unlikeReview: async (req, res) => {
        try {
            const { id } = req.params;
            const reviewIndex = reviews.findIndex(r => r.id === parseInt(id));
            
            if (reviewIndex === -1) {
                return res.status(404).json({ error: 'Review não encontrada' });
            }

            if (reviews[reviewIndex].likes > 0) {
                reviews[reviewIndex].likes -= 1;
            }
            
            res.json({ likes: reviews[reviewIndex].likes });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover like' });
        }
    }
};

module.exports = reviewController;