const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUser(data) {
  return prisma.usuario.create({ data });
}

async function findUserByEmail(email) {
  return prisma.usuario.findUnique({ where: { email } });
}

async function getAllUsers() {
  return prisma.usuario.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

async function getUserById(id) {
  return prisma.usuario.findUnique({ where: { id: parseInt(id) } });
}

async function updateUser(id, data) {
  return prisma.usuario.update({
    where: { id: parseInt(id) },
    data
  });
}

async function deleteUser(id) {
  return prisma.usuario.delete({ where: { id: parseInt(id) } });
}

// Funções de Livros
async function createBook(data) {
  return prisma.livro.create({ data });
}

async function getAllBooks() {
  return prisma.livro.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

async function getBookById(id) {
  return prisma.livro.findUnique({ where: { id: parseInt(id) } });
}

async function updateBook(id, data) {
  return prisma.livro.update({
    where: { id: parseInt(id) },
    data
  });
}

async function deleteBook(id) {
  return prisma.livro.delete({ where: { id: parseInt(id) } });
}

// Funções de Resenhas
async function createResenha(data) {
  return prisma.resenha.create({ 
    data,
    include: {
      livro: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true
        }
      }
    }
  });
}

async function getAllResenhas() {
  return prisma.resenha.findMany({
    include: {
      livro: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function getResenhasByLivroId(livroId) {
  return prisma.resenha.findMany({
    where: { 
      livroId: parseInt(livroId),
      ativo: true
    },
    include: {
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function getResenhaById(id) {
  return prisma.resenha.findUnique({ 
    where: { id: parseInt(id) },
    include: {
      livro: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true
        }
      }
    }
  });
}

async function updateResenha(id, data) {
  return prisma.resenha.update({
    where: { id: parseInt(id) },
    data,
    include: {
      livro: true,
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true
        }
      }
    }
  });
}

async function deleteResenha(id) {
  return prisma.resenha.delete({ where: { id: parseInt(id) } });
}

module.exports = { 
  createUser, 
  findUserByEmail, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  createResenha,
  getAllResenhas,
  getResenhasByLivroId,
  getResenhaById,
  updateResenha,
  deleteResenha
};
