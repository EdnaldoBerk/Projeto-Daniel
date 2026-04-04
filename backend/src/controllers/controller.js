const crypto = require('crypto');
const { createUser, findUserByEmail, getAllUsers, getUserById, updateUser, deleteUser, createBook, getAllBooks, getBookById, updateBook, deleteBook, createResenha, getAllResenhas, getResenhasByLivroId, getResenhaById, updateResenha, deleteResenha, addFavorito, removeFavorito, getFavoritosByUsuarioId, checkFavorito, addCurtidaResenha, removeCurtidaResenha, checkCurtidaResenha, addOrUpdateAvaliacaoResenha, getAvaliacaoStatsByResenhaId, searchLivros, createComentario, getComentariosByResenhaId, deleteComentario, getComentarioById, getAllComentariosAdmin, updateComentarioAdmin, deleteComentarioAdmin, criarDenunciaComentario, getDenunciasComentarios, atualizarStatusDenuncia, deleteDenunciaComentario } = require('../services/service');

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const passwordResetTokens = new Map();

function cleanupExpiredResetTokens() {
  const now = Date.now();
  for (const [token, payload] of passwordResetTokens.entries()) {
    if (payload.expiresAt <= now) {
      passwordResetTokens.delete(token);
    }
  }
}

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
    return res.json({ 
      id: usuario.id, 
      nome: usuario.nome, 
      email: usuario.email,
      fotoPerfil: usuario.fotoPerfil 
    });
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

async function solicitarRecuperacaoSenha(req, res) {
  const { email } = req.body;

  if (!email || String(email).trim().length === 0) {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  try {
    cleanupExpiredResetTokens();
    const usuario = await findUserByEmail(String(email).trim());

    // Resposta genérica para não revelar se o email existe.
    if (!usuario) {
      return res.json({
        message: 'Se o email estiver cadastrado, enviaremos instruções de recuperação.'
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + RESET_TOKEN_TTL_MS;

    passwordResetTokens.set(token, {
      userId: usuario.id,
      expiresAt
    });

    const resetLink = `/esqueci-senha?token=${encodeURIComponent(token)}`;

    return res.json({
      message: 'Solicitação recebida. Use o link de recuperação para redefinir sua senha.',
      resetToken: token,
      resetLink,
      expiresInMinutes: 15
    });
  } catch (e) {
    console.error('Erro ao solicitar recuperação de senha:', e);
    return res.status(500).json({ error: 'Erro ao processar recuperação de senha' });
  }
}

async function redefinirSenha(req, res) {
  const { token, novaSenha, confirmarSenha } = req.body;

  if (!token || !novaSenha || !confirmarSenha) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
  }

  if (String(novaSenha).length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
  }

  if (novaSenha !== confirmarSenha) {
    return res.status(400).json({ error: 'As senhas não conferem' });
  }

  try {
    cleanupExpiredResetTokens();
    const payload = passwordResetTokens.get(String(token));

    if (!payload) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    if (payload.expiresAt <= Date.now()) {
      passwordResetTokens.delete(String(token));
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    await updateUser(payload.userId, { senha: novaSenha });

    // Invalida todos os tokens pendentes do usuário após redefinir senha.
    for (const [storedToken, storedPayload] of passwordResetTokens.entries()) {
      if (storedPayload.userId === payload.userId) {
        passwordResetTokens.delete(storedToken);
      }
    }

    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch (e) {
    console.error('Erro ao redefinir senha:', e);
    return res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
}

// Busca genérica
async function buscar(req, res) {
  try {
    const { q = '' } = req.query;
    if (!q || String(q).trim().length === 0) {
      return res.json({ results: [] });
    }

    const livros = await searchLivros({ q });
    return res.json({ results: livros });
  } catch (e) {
    console.error('Erro na busca:', e);
    return res.status(500).json({ error: 'Erro ao realizar busca' });
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
  const { nome, email, telefone, cpf, isAdmin, senha, bio } = req.body;
  
  try {
    const dataToUpdate = {};
    if (nome !== undefined) dataToUpdate.nome = nome;
    if (email !== undefined) dataToUpdate.email = email;
    if (telefone !== undefined) dataToUpdate.telefone = telefone;
    if (cpf !== undefined) dataToUpdate.cpf = cpf;
    if (isAdmin !== undefined) dataToUpdate.isAdmin = isAdmin;
    if (senha !== undefined) dataToUpdate.senha = senha;
    if (bio !== undefined) dataToUpdate.bio = bio;

    const usuario = await updateUser(id, dataToUpdate);
    const { senha: senhaOmitida, ...dadosSemSenha } = usuario;
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

// Controladores de Curtidas em Resenhas
async function curtirResenha(req, res) {
  const { resenhaId } = req.params;
  const { usuarioId } = req.body;
  
  try {
    if (!usuarioId) {
      return res.status(400).json({ error: 'usuarioId é obrigatório' });
    }
    
    // Verificar se já curtiu
    const jaCurtiu = await checkCurtidaResenha(usuarioId, resenhaId);
    if (jaCurtiu) {
      return res.status(409).json({ error: 'Você já curtiu esta resenha' });
    }
    
    await addCurtidaResenha(usuarioId, resenhaId);
    
    // Retornar resenha atualizada
    const resenha = await getResenhaById(resenhaId);
    return res.json({ curtidas: resenha.curtidas, curtiu: true });
  } catch (e) {
    console.error('Erro ao curtir resenha:', e);
    return res.status(500).json({ error: 'Erro ao curtir resenha' });
  }
}

async function descurtirResenha(req, res) {
  const { resenhaId } = req.params;
  const { usuarioId } = req.body;
  
  try {
    if (!usuarioId) {
      return res.status(400).json({ error: 'usuarioId é obrigatório' });
    }
    
    await removeCurtidaResenha(usuarioId, resenhaId);
    
    // Retornar resenha atualizada
    const resenha = await getResenhaById(resenhaId);
    return res.json({ curtidas: resenha.curtidas, curtiu: false });
  } catch (e) {
    console.error('Erro ao descurtir resenha:', e);
    return res.status(500).json({ error: 'Erro ao descurtir resenha' });
  }
}

async function verificarCurtidaResenha(req, res) {
  const { resenhaId, usuarioId } = req.params;
  
  try {
    const curtiu = await checkCurtidaResenha(usuarioId, resenhaId);
    return res.json({ curtiu });
  } catch (e) {
    console.error('Erro ao verificar curtida:', e);
    return res.status(500).json({ error: 'Erro ao verificar curtida' });
  }
}

async function avaliarResenha(req, res) {
  const { resenhaId } = req.params;
  const { usuarioId, nota } = req.body;

  try {
    if (!usuarioId || nota === undefined) {
      return res.status(400).json({ error: 'usuarioId e nota são obrigatórios' });
    }

    const notaNumero = Number(nota);
    if (!Number.isInteger(notaNumero) || notaNumero < 1 || notaNumero > 5) {
      return res.status(400).json({ error: 'A nota deve ser um inteiro entre 1 e 5' });
    }

    await addOrUpdateAvaliacaoResenha(usuarioId, resenhaId, notaNumero);
    const stats = await getAvaliacaoStatsByResenhaId(resenhaId, usuarioId);
    return res.json(stats);
  } catch (e) {
    console.error('Erro ao avaliar resenha:', e);
    return res.status(500).json({ error: 'Erro ao registrar avaliação' });
  }
}

async function obterAvaliacaoResenha(req, res) {
  const { resenhaId } = req.params;
  const { usuarioId } = req.query;

  try {
    const stats = await getAvaliacaoStatsByResenhaId(resenhaId, usuarioId || null);
    return res.json(stats);
  } catch (e) {
    console.error('Erro ao obter avaliação da resenha:', e);
    return res.status(500).json({ error: 'Erro ao obter avaliação da resenha' });
  }
}

// Controladores de Comentários
async function criarComentario(req, res) {
  const { resenhaId, usuarioId, texto, nota } = req.body;
  
  console.log('📝 Recebido pedido de criar comentário:', { resenhaId, usuarioId, nota, texto: texto?.substring(0, 50) });
  
  try {
    if (!resenhaId || !usuarioId || !texto) {
      console.error('❌ Campos faltando:', { resenhaId, usuarioId, textoExists: !!texto });
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const notaNumero = Number(nota);
    if (!Number.isInteger(notaNumero) || notaNumero < 1 || notaNumero > 5) {
      return res.status(400).json({ error: 'A nota do comentário deve ser um inteiro entre 1 e 5' });
    }
    
    const comentario = await createComentario(usuarioId, resenhaId, texto, notaNumero);
    console.log('✅ Comentário criado com sucesso:', comentario);
    return res.status(201).json(comentario);
  } catch (e) {
    console.error('❌ Erro ao criar comentário:', e);
    return res.status(500).json({ error: 'Erro ao criar comentário', details: e.message });
  }
}

async function listarComentariosResenha(req, res) {
  const { resenhaId } = req.params;
  
  console.log('📋 Listando comentários para resenhaId:', resenhaId);
  
  try {
    const comentarios = await getComentariosByResenhaId(resenhaId);
    console.log('✅ Comentários encontrados:', comentarios.length);
    return res.json(comentarios);
  } catch (e) {
    console.error('❌ Erro ao listar comentários:', e);
    return res.status(500).json({ error: 'Erro ao listar comentários' });
  }
}

async function deletarComentario(req, res) {
  const { comentarioId } = req.params;
  
  console.log('🗑️  Deletando comentário:', comentarioId);
  
  try {
    await deleteComentario(comentarioId);
    console.log('✅ Comentário deletado com sucesso');
    return res.json({ message: 'Comentário deletado com sucesso' });
  } catch (e) {
    console.error('❌ Erro ao deletar comentário:', e);
    if (e.code === 'P2025' || e.message === 'Comentário não encontrado') {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    return res.status(500).json({ error: 'Erro ao deletar comentário' });
  }
}

module.exports = { 
  registrarUsuario, 
  logarUsuario, 
  logarAdmin, 
  solicitarRecuperacaoSenha,
  redefinirSenha,
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
  uploadFotoPerfil,
  curtirResenha,
  descurtirResenha,
  verificarCurtidaResenha,
  avaliarResenha,
  obterAvaliacaoResenha,
  criarComentario,
  listarComentariosResenha,
  deletarComentario,
  buscar,
  listarTodosComentarios,
  atualizarComentarioAdmin,
  deletarComentarioAdmin,
  criarDenuncia,
  listarDenuncias,
  atualizarStatusDenunciaCtrl,
  deletarDenunciaCtrl
};

// Controladores de Admin para Comentários
async function listarTodosComentarios(req, res) {
  try {
    const comentarios = await getAllComentariosAdmin();
    return res.json(comentarios);
  } catch (e) {
    console.error('❌ Erro ao listar comentários:', e);
    return res.status(500).json({ error: 'Erro ao listar comentários' });
  }
}

async function atualizarComentarioAdmin(req, res) {
  const { comentarioId } = req.params;
  const { texto } = req.body;
  
  try {
    if (!texto || !texto.trim()) {
      return res.status(400).json({ error: 'Texto do comentário é obrigatório' });
    }
    
    const comentario = await updateComentarioAdmin(comentarioId, texto.trim());
    return res.json(comentario);
  } catch (e) {
    console.error('❌ Erro ao atualizar comentário:', e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar comentário' });
  }
}

async function deletarComentarioAdmin(req, res) {
  const { comentarioId } = req.params;
  
  try {
    await deleteComentarioAdmin(comentarioId);
    return res.json({ message: 'Comentário deletado com sucesso' });
  } catch (e) {
    console.error('❌ Erro ao deletar comentário:', e);
    if (e.code === 'P2025' || e.message === 'Comentário não encontrado') {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    return res.status(500).json({ error: 'Erro ao deletar comentário' });
  }
}

// Controladores de Denúncias
async function criarDenuncia(req, res) {
  const { usuarioId, comentarioId, motivo, descricao } = req.body;
  
  console.log('📨 Recebendo denúncia:', { usuarioId, comentarioId, motivo });
  
  try {
    if (!usuarioId || !comentarioId || !motivo) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    
    const motivosValidos = ['spam', 'ofensivo', 'inapropriado', 'conteudo_falso', 'outro'];
    if (!motivosValidos.includes(motivo)) {
      return res.status(400).json({ error: 'Motivo inválido' });
    }
    
    const denuncia = await criarDenunciaComentario(usuarioId, comentarioId, motivo, descricao);
    return res.status(201).json(denuncia);
  } catch (e) {
    console.error('❌ Erro ao criar denúncia:', e);
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Você já denunciou este comentário' });
    }
    return res.status(500).json({ error: 'Erro ao criar denúncia' });
  }
}

async function listarDenuncias(req, res) {
  const { status } = req.query;
  
  try {
    const denuncias = await getDenunciasComentarios(status || null);
   return res.json(denuncias);
  } catch (e) {
    console.error('❌ Erro ao listar denúncias:', e);
    return res.status(500).json({ error: 'Erro ao listar denúncias' });
  }
}

async function atualizarStatusDenunciaCtrl(req, res) {
  const { denunciaId } = req.params;
  const { status } = req.body;
  
  try {
    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório' });
    }
    
    const statusValidos = ['pendente', 'analisado', 'rejeitado'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }
    
    const denuncia = await atualizarStatusDenuncia(denunciaId, status);
    return res.json(denuncia);
  } catch (e) {
    console.error('❌ Erro ao atualizar denúncia:', e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar denúncia' });
  }
}

async function deletarDenunciaCtrl(req, res) {
  const { denunciaId } = req.params;

  try {
    await deleteDenunciaComentario(denunciaId);
    return res.json({ message: 'Denúncia removida com sucesso' });
  } catch (e) {
    console.error('❌ Erro ao remover denúncia:', e);
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Denúncia não encontrada' });
    }
    return res.status(500).json({ error: 'Erro ao remover denúncia' });
  }
}
