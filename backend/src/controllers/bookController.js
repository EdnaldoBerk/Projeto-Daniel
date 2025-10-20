// Controlador temporário com dados mockados
const books = [];

const bookController = {
    // Listar todos os livros
    getAllBooks: async (req, res) => {
        try {
            // TODO: Implementar busca no banco de dados
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar livros' });
        }
    },

    // Buscar livro por ID
    getBookById: async (req, res) => {
        try {
            const { id } = req.params;
            const book = books.find(b => b.id === parseInt(id));
            
            if (!book) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }
            
            res.json(book);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar livro' });
        }
    },

    // Buscar livros por gênero
    getBooksByGenre: async (req, res) => {
        try {
            const { genre } = req.params;
            const filteredBooks = books.filter(book => 
                book.genre.toLowerCase() === genre.toLowerCase()
            );
            res.json(filteredBooks);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar livros por gênero' });
        }
    },

    // Buscar livros por termo de pesquisa
    searchBooks: async (req, res) => {
        try {
            const { query } = req.params;
            const filteredBooks = books.filter(book => 
                book.title.toLowerCase().includes(query.toLowerCase()) ||
                book.author.toLowerCase().includes(query.toLowerCase())
            );
            res.json(filteredBooks);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao pesquisar livros' });
        }
    },

    // Criar novo livro
    createBook: async (req, res) => {
        try {
            const { title, author, genre, description } = req.body;
            
            // Validação básica
            if (!title || !author || !genre) {
                return res.status(400).json({ 
                    error: 'Título, autor e gênero são obrigatórios' 
                });
            }

            const newBook = {
                id: books.length + 1,
                title,
                author,
                genre,
                description,
                createdAt: new Date()
            };

            books.push(newBook);
            res.status(201).json(newBook);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar livro' });
        }
    },

    // Atualizar livro
    updateBook: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, author, genre, description } = req.body;

            const bookIndex = books.findIndex(b => b.id === parseInt(id));
            
            if (bookIndex === -1) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            const updatedBook = {
                ...books[bookIndex],
                title: title || books[bookIndex].title,
                author: author || books[bookIndex].author,
                genre: genre || books[bookIndex].genre,
                description: description || books[bookIndex].description,
                updatedAt: new Date()
            };

            books[bookIndex] = updatedBook;
            res.json(updatedBook);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar livro' });
        }
    },

    // Deletar livro
    deleteBook: async (req, res) => {
        try {
            const { id } = req.params;
            const bookIndex = books.findIndex(b => b.id === parseInt(id));
            
            if (bookIndex === -1) {
                return res.status(404).json({ error: 'Livro não encontrado' });
            }

            books.splice(bookIndex, 1);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar livro' });
        }
    }
};

module.exports = bookController;