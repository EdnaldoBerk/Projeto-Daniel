// Array temporário para simular banco de dados
const users = [];

const userController = {
    // Registro de usuário
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Validação básica
            if (!username || !email || !password) {
                return res.status(400).json({
                    error: 'Username, email e senha são obrigatórios'
                });
            }

            // Verificar se usuário já existe
            const userExists = users.some(u => u.email === email);
            if (userExists) {
                return res.status(400).json({
                    error: 'Usuário já cadastrado'
                });
            }

            // Em produção, fazer hash da senha antes de salvar
            const newUser = {
                id: users.length + 1,
                username,
                email,
                password, // Em produção, salvar hash
                favorites: [],
                createdAt: new Date()
            };

            users.push(newUser);

            // Não retornar a senha
            const { password: _, ...userWithoutPassword } = newUser;
            res.status(201).json(userWithoutPassword);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
    },

    // Login de usuário
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validação básica
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email e senha são obrigatórios'
                });
            }

            // Buscar usuário
            const user = users.find(u => u.email === email);
            if (!user || user.password !== password) { // Em produção, comparar hash
                return res.status(401).json({
                    error: 'Email ou senha inválidos'
                });
            }

            // Em produção, gerar JWT token
            const token = 'mock-jwt-token';

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao fazer login' });
        }
    },

    // Obter perfil do usuário
    getProfile: async (req, res) => {
        try {
            // Em produção, pegar ID do token JWT
            const userId = req.header('user-id');
            
            const user = users.find(u => u.id === parseInt(userId));
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const { password: _, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar perfil' });
        }
    },

    // Atualizar perfil
    updateProfile: async (req, res) => {
        try {
            const userId = req.header('user-id');
            const { username, email } = req.body;

            const userIndex = users.findIndex(u => u.id === parseInt(userId));
            if (userIndex === -1) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const updatedUser = {
                ...users[userIndex],
                username: username || users[userIndex].username,
                email: email || users[userIndex].email,
                updatedAt: new Date()
            };

            users[userIndex] = updatedUser;

            const { password: _, ...userWithoutPassword } = updatedUser;
            res.json(userWithoutPassword);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar perfil' });
        }
    },

    // Listar reviews do usuário
    getUserReviews: async (req, res) => {
        try {
            const userId = req.header('user-id');
            // TODO: Implementar quando tivermos o controller de reviews
            res.json([]);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar reviews' });
        }
    },

    // Listar livros favoritos
    getFavoriteBooks: async (req, res) => {
        try {
            const userId = req.header('user-id');
            
            const user = users.find(u => u.id === parseInt(userId));
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.json(user.favorites);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar favoritos' });
        }
    },

    // Adicionar livro aos favoritos
    addToFavorites: async (req, res) => {
        try {
            const userId = req.header('user-id');
            const { bookId } = req.params;

            const userIndex = users.findIndex(u => u.id === parseInt(userId));
            if (userIndex === -1) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            if (!users[userIndex].favorites.includes(parseInt(bookId))) {
                users[userIndex].favorites.push(parseInt(bookId));
            }

            res.json(users[userIndex].favorites);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar favorito' });
        }
    },

    // Remover livro dos favoritos
    removeFromFavorites: async (req, res) => {
        try {
            const userId = req.header('user-id');
            const { bookId } = req.params;

            const userIndex = users.findIndex(u => u.id === parseInt(userId));
            if (userIndex === -1) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            users[userIndex].favorites = users[userIndex].favorites.filter(
                id => id !== parseInt(bookId)
            );

            res.json(users[userIndex].favorites);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao remover favorito' });
        }
    }
};

module.exports = userController;