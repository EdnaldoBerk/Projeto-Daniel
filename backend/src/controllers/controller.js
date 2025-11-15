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
    return res.status(201).json({ id: novo.id, email: novo.email });
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
    return res.json({ id: usuario.id, email: usuario.email });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao realizar login' });
  }
}

module.exports = { registrarUsuario, logarUsuario };
