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

module.exports = { createUser, findUserByEmail, getAllUsers, getUserById, updateUser, deleteUser };
