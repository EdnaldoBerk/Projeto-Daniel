const { createUser, findUserByEmail, getAllUsers, getUserById, updateUser, deleteUser, createBook, getAllBooks, getBookById, updateBook, deleteBook, createResenha, getAllResenhas, getResenhasByLivroId, getResenhaById, updateResenha, deleteResenha, addFavorito, removeFavorito, getFavoritosByUsuarioId, checkFavorito } = require('../services/service');

async function registrarUsuario(req, res) {
  // TODO: validação e hashing de senha
  const { nome, email, telefone, cpf, senha } = req.body;
  try {
    const existente = await findUserByEmail(email);
    if (existente) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    const novo = await createUser({ nome, email, telefone, cpf, senha });
    return res.status(201).json({ id: novo.id, nome: novo.nome, email: novo.email });
  } catch (e) {
    console.error('Erro ao registrar usuário:', e); // Log detalhado do erro
    if (e.code === 'P2002' && Array.isArray(e.meta?.target)) {
      const field = e.meta.target.includes('cpf') ? 'CPF' : 'Email';
      return res.status(409).json({ error: `${field} já cadastrado` });
    }
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}

async function logarUsuario(req, res) {
  // TODO: validar senha (comparar hash)
  const { email, senha } = req.body;
  console.log('Tentativa de login:', { email, senha });
  try {
    const usuario = await findUserByEmail(email);
    console.log('Usuário encontrado:', usuario ? { id: usuario.id, email: usuario.email, senha: usuario.senha } : 'não encontrado');
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    // Comparar senha futuramente
    console.log('Comparando senhas:', { recebida: senha, armazenada: usuario.senha, iguais: usuario.senha === senha });
    if (usuario.senha !== senha) return res.status(401).json({ error: 'Credenciais inválidas' });
    return res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao realizar login' });
  }
}

async function logarAdmin(req, res) {
  const { email, senha, accessKey } = req.body;
  
  // Chave de acesso secreta (em produção, use variável de ambiente)
  const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || 'projeto-daniel';
  
  console.log('Tentativa de login admin:', { email, accessKey });
  
  try {
    // Validar chave de acesso primeiro
    if (accessKey !== ADMIN_ACCESS_KEY) {
      return res.status(403).json({ error: 'Chave de acesso inválida' });
    }

    const usuario = await findUserByEmail(email);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar se é admin
    if (!usuario.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado: privilégios insuficientes' });
    }
    
    // Validar senha
    if (usuario.senha !== senha) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    return res.json({ 
      id: usuario.id, 
      nome: usuario.nome, 
      email: usuario.email,
      isAdmin: true
    });
  } catch (e) {
    console.error('Erro no login admin:', e);
    return res.status(500).json({ error: 'Erro ao realizar login administrativo' });
  }
}

module.exports = { registrarUsuario, logarUsuario };
async function obterUsuarioPorEmail(req, res) {
  const { email } = req.params;
  try {
    const usuario = await findUserByEmail(email);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (e) {
    console.error('Erro ao buscar usuário:', e);
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

async function listarUsuarios(req, res) {
  try {
    const usuarios = await getAllUsers();
    const usuariosSemSenha = usuarios.map(u => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      telefone: u.telefone,
      cpf: u.cpf,
      isAdmin: u.isAdmin,
      createdAt: u.createdAt
    }));
    return res.json(usuariosSemSenha);
  } catch (e) {
    console.error('Erro ao listar usuários:', e);
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

async function buscarUsuarioPorId(req, res) {
  const { id } = req.params;
  try {
    const usuario = await getUserById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const { senha, ...dadosSemSenha } = usuario;
    return res.json(dadosSemSenha);
  } catch (e) {
    console.error('Erro ao buscar usuário:', e);
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

async function atualizarUsuario(req, res) {
  const { id } = req.params;
  const { nome, email, telefone, cpf, isAdmin } = req.body;
  
  try {
    const dataToUpdate = {};
    if (nome !== undefined) dataToUpdate.nome = nome;
    if (email !== undefined) dataToUpdate.email = email;
    if (telefone !== undefined) dataToUpdate.telefone = telefone;
    if (cpf !== undefined) dataToUpdate.cpf = cpf;
    if (isAdmin !== undefined) dataToUpdate.isAdmin = isAdmin;

    const usuario = await updateUser(id, dataToUpdate);
    const { senha, ...dadosSemSenha } = usuario;
    return res.json(dadosSemSenha);
  } catch (e) {
    console.error('Erro ao atualizar usuário:', e);
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Email ou CPF já cadastrado' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
}

async function deletarUsuario(req, res) {
  const { id } = req.params;
  try {
    await deleteUser(id);
    return res.json({ message: 'Usuário deletado com sucesso' });
  } catch (e) {
    console.error('Erro ao deletar usuário:', e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
}

// Controladores de Livros
async function criarLivro(req, res) {
  try {
    const { titulo, autor, ano, editora, paginas, isbn, categoria, sinopse, idioma, edicao } = req.body;
    
    // Foto da capa (obrigatória)
    if (!req.files || !req.files.fotoCapa || req.files.fotoCapa.length === 0) {
      return res.status(400).json({ error: 'Foto da capa é obrigatória' });
    }

    const fotoCapa = `/uploads/books/${req.files.fotoCapa[0].filename}`;
    
    // Galeria (opcional)
    let galeria = [];
    if (req.files.galeria) {
      galeria = req.files.galeria.map(file => `/uploads/books/${file.filename}`);
    }

    const livro = await createBook({
      titulo,
      autor,
      ano: parseInt(ano),
      editora,
      paginas: parseInt(paginas),
      isbn: isbn || null,
      categoria: categoria || null,
      sinopse: sinopse || null,
      idioma: idioma || 'Português',
      edicao: edicao || null,
      fotoCapa,
      galeria
    });

    return res.status(201).json(livro);
  } catch (e) {
    console.error('Erro ao criar livro:', e);
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'ISBN já cadastrado' });
    }
    return res.status(500).json({ error: 'Erro ao criar livro' });
  }
}

async function listarLivros(req, res) {
  try {
    const livros = await getAllBooks();
    return res.json(livros);
  } catch (e) {
    console.error('Erro ao listar livros:', e);
    return res.status(500).json({ error: 'Erro ao listar livros' });
  }
}

async function buscarLivroPorId(req, res) {
  const { id } = req.params;
  try {
    const livro = await getBookById(id);
    if (!livro) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    return res.json(livro);
  } catch (e) {
    console.error('Erro ao buscar livro:', e);
    return res.status(500).json({ error: 'Erro ao buscar livro' });
  }
}

async function atualizarLivro(req, res) {
  const { id } = req.params;
  try {
    const { titulo, autor, ano, editora, paginas, isbn, categoria, sinopse, idioma, edicao, ativo } = req.body;
    
    const dataToUpdate = {};
    if (titulo !== undefined) dataToUpdate.titulo = titulo;
    if (autor !== undefined) dataToUpdate.autor = autor;
    if (ano !== undefined) dataToUpdate.ano = parseInt(ano);
    if (editora !== undefined) dataToUpdate.editora = editora;
    if (paginas !== undefined) dataToUpdate.paginas = parseInt(paginas);
    if (isbn !== undefined) dataToUpdate.isbn = isbn || null;
    if (categoria !== undefined) dataToUpdate.categoria = categoria || null;
    if (sinopse !== undefined) dataToUpdate.sinopse = sinopse || null;
    if (idioma !== undefined) dataToUpdate.idioma = idioma;
    if (edicao !== undefined) dataToUpdate.edicao = edicao || null;
    if (ativo !== undefined) dataToUpdate.ativo = ativo;

    // Atualizar foto da capa se fornecida
    if (req.files && req.files.fotoCapa && req.files.fotoCapa.length > 0) {
      dataToUpdate.fotoCapa = `/uploads/books/${req.files.fotoCapa[0].filename}`;
    }

    // Atualizar galeria se fornecida
    if (req.files && req.files.galeria) {
      const novasImagens = req.files.galeria.map(file => `/uploads/books/${file.filename}`);
      // Mesclar com galeria existente ou substituir
      const livroAtual = await getBookById(id);
      dataToUpdate.galeria = [...livroAtual.galeria, ...novasImagens];
    }

    const livro = await updateBook(id, dataToUpdate);
    return res.json(livro);
  } catch (e) {
    console.error('Erro ao atualizar livro:', e);
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'ISBN já cadastrado' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar livro' });
  }
}

async function deletarLivro(req, res) {
  const { id } = req.params;
  try {
    await deleteBook(id);
    return res.json({ message: 'Livro deletado com sucesso' });
  } catch (e) {
    console.error('Erro ao deletar livro:', e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    return res.status(500).json({ error: 'Erro ao deletar livro' });
  }
}

// Controladores de Resenhas
async function criarResenha(req, res) {
  try {
    const { livroId, usuarioId, titulo, textoResumo, textoCompleto, avaliacao, trechosMarcantes } = req.body;
    
    if (!livroId || !usuarioId || !titulo || !textoResumo || !textoCompleto || avaliacao === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const resenha = await createResenha({
      livroId: parseInt(livroId),
      usuarioId: parseInt(usuarioId),
      titulo,
      textoResumo,
      textoCompleto,
      avaliacao: parseFloat(avaliacao),
      trechosMarcantes: trechosMarcantes || []
    });

    return res.status(201).json(resenha);
  } catch (e) {
    console.error('Erro ao criar resenha:', e);
    return res.status(500).json({ error: 'Erro ao criar resenha' });
  }
}

async function listarResenhas(req, res) {
  try {
    const resenhas = await getAllResenhas();
    return res.json(resenhas);
  } catch (e) {
    console.error('Erro ao listar resenhas:', e);
    return res.status(500).json({ error: 'Erro ao listar resenhas' });
  }
}

async function listarResenhasPorLivro(req, res) {
  const { livroId } = req.params;
  try {
    const resenhas = await getResenhasByLivroId(livroId);
    return res.json(resenhas);
  } catch (e) {
    console.error('Erro ao listar resenhas do livro:', e);
    return res.status(500).json({ error: 'Erro ao listar resenhas' });
  }
}

async function buscarResenhaPorId(req, res) {
  const { id } = req.params;
  try {
    const resenha = await getResenhaById(id);
    if (!resenha) {
      return res.status(404).json({ error: 'Resenha não encontrada' });
    }
    return res.json(resenha);
  } catch (e) {
    console.error('Erro ao buscar resenha:', e);
    return res.status(500).json({ error: 'Erro ao buscar resenha' });
  }
}

async function atualizarResenha(req, res) {
  const { id } = req.params;
  try {
    const { titulo, textoResumo, textoCompleto, avaliacao, trechosMarcantes, ativo } = req.body;
    
    const dataToUpdate = {};
    if (titulo !== undefined) dataToUpdate.titulo = titulo;
    if (textoResumo !== undefined) dataToUpdate.textoResumo = textoResumo;
    if (textoCompleto !== undefined) dataToUpdate.textoCompleto = textoCompleto;
    if (avaliacao !== undefined) dataToUpdate.avaliacao = parseFloat(avaliacao);
    if (trechosMarcantes !== undefined) dataToUpdate.trechosMarcantes = trechosMarcantes;
    if (ativo !== undefined) dataToUpdate.ativo = ativo;

    const resenha = await updateResenha(id, dataToUpdate);
    return res.json(resenha);
  } catch (e) {
    console.error('Erro ao atualizar resenha:', e);
    return res.status(500).json({ error: 'Erro ao atualizar resenha' });
  }
}

async function deletarResenha(req, res) {
  const { id } = req.params;
  try {
    await deleteResenha(id);
    return res.json({ message: 'Resenha deletada com sucesso' });
  } catch (e) {
    console.error('Erro ao deletar resenha:', e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Resenha não encontrada' });
    }
    return res.status(500).json({ error: 'Erro ao deletar resenha' });
  }
}

// Controladores de Favoritos
async function adicionarFavorito(req, res) {
  const { usuarioId, livroId } = req.body;
  try {
    const favorito = await addFavorito(usuarioId, livroId);
    return res.status(201).json(favorito);
  } catch (e) {
    console.error('Erro ao adicionar favorito:', e);
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Livro já está nos favoritos' });
    }
    return res.status(500).json({ error: 'Erro ao adicionar favorito' });
  }
}

async function removerFavorito(req, res) {
  const { usuarioId, livroId } = req.params;
  try {
    await removeFavorito(usuarioId, livroId);
    return res.json({ message: 'Favorito removido com sucesso' });
  } catch (e) {
    console.error('Erro ao remover favorito:', e);
    return res.status(500).json({ error: 'Erro ao remover favorito' });
  }
}

async function listarFavoritosUsuario(req, res) {
  const { usuarioId } = req.params;
  try {
    const favoritos = await getFavoritosByUsuarioId(usuarioId);
    return res.json(favoritos);
  } catch (e) {
    console.error('Erro ao listar favoritos:', e);
    return res.status(500).json({ error: 'Erro ao listar favoritos' });
  }
}

async function verificarFavorito(req, res) {
  const { usuarioId, livroId } = req.params;
  try {
    const isFavorito = await checkFavorito(usuarioId, livroId);
    return res.json({ isFavorito });
  } catch (e) {
    console.error('Erro ao verificar favorito:', e);
    return res.status(500).json({ error: 'Erro ao verificar favorito' });
  }
}

// Upload de foto de perfil
async function uploadFotoPerfil(req, res) {
  const { usuarioId } = req.body;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const fotoPerfil = `/uploads/perfil/${req.file.filename}`;
    
    await updateUser(usuarioId, { fotoPerfil });
    
    return res.json({ fotoPerfil, message: 'Foto atualizada com sucesso' });
  } catch (e) {
    console.error('Erro ao fazer upload da foto:', e);
    return res.status(500).json({ error: 'Erro ao fazer upload da foto' });
  }
}

module.exports = { 
  registrarUsuario, 
  logarUsuario, 
  logarAdmin, 
  obterUsuarioPorEmail, 
  listarUsuarios, 
  buscarUsuarioPorId, 
  atualizarUsuario, 
  deletarUsuario,
  criarLivro,
  listarLivros,
  buscarLivroPorId,
  atualizarLivro,
  deletarLivro,
  criarResenha,
  listarResenhas,
  listarResenhasPorLivro,
  buscarResenhaPorId,
  atualizarResenha,
  deletarResenha,
  adicionarFavorito,
  removerFavorito,
  listarFavoritosUsuario,
  verificarFavorito,
  uploadFotoPerfil
};
