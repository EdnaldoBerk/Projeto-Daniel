const { createUser, findUserByEmail } = require('../services/service');

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

module.exports = { registrarUsuario, logarUsuario, logarAdmin, obterUsuarioPorEmail };
