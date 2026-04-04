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

// Busca
async function searchLivros({ q }) {
  const query = q?.trim() || '';
  if (!query) return [];
  const contains = { contains: query, mode: 'insensitive' };
  const where = {
    AND: [
      { ativo: true },
      {
        OR: [
          { titulo: contains },
          { autor: contains },
          { editora: contains },
          { categoria: contains },
          { isbn: contains }
        ]
      }
    ]
  };
  return prisma.livro.findMany({ where, orderBy: { createdAt: 'desc' } });
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

// Funções de Favoritos
async function addFavorito(usuarioId, livroId) {
  return prisma.favorito.create({
    data: {
      usuarioId: parseInt(usuarioId),
      livroId: parseInt(livroId)
    },
    include: {
      livro: true
    }
  });
}

async function removeFavorito(usuarioId, livroId) {
  return prisma.favorito.deleteMany({
    where: {
      usuarioId: parseInt(usuarioId),
      livroId: parseInt(livroId)
    }
  });
}

async function getFavoritosByUsuarioId(usuarioId) {
  return prisma.favorito.findMany({
    where: { usuarioId: parseInt(usuarioId) },
    include: {
      livro: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function checkFavorito(usuarioId, livroId) {
  const favorito = await prisma.favorito.findFirst({
    where: {
      usuarioId: parseInt(usuarioId),
      livroId: parseInt(livroId)
    }
  });
  return !!favorito;
}

// Funções de Curtidas em Resenhas
async function addCurtidaResenha(usuarioId, resenhaId) {
  // Adicionar curtida
  const curtida = await prisma.curtidaResenha.create({
    data: {
      usuarioId: parseInt(usuarioId),
      resenhaId: parseInt(resenhaId)
    }
  });
  
  // Incrementar contador de curtidas na resenha
  await prisma.resenha.update({
    where: { id: parseInt(resenhaId) },
    data: { curtidas: { increment: 1 } }
  });
  
  return curtida;
}

async function removeCurtidaResenha(usuarioId, resenhaId) {
  // Remover curtida
  await prisma.curtidaResenha.deleteMany({
    where: {
      usuarioId: parseInt(usuarioId),
      resenhaId: parseInt(resenhaId)
    }
  });
  
  // Decrementar contador de curtidas na resenha
  await prisma.resenha.update({
    where: { id: parseInt(resenhaId) },
    data: { curtidas: { decrement: 1 } }
  });
}

async function checkCurtidaResenha(usuarioId, resenhaId) {
  const curtida = await prisma.curtidaResenha.findFirst({
    where: {
      usuarioId: parseInt(usuarioId),
      resenhaId: parseInt(resenhaId)
    }
  });
  return !!curtida;
}

// Funções de Comentários
async function createComentario(usuarioId, resenhaId, texto) {
  console.log('💾 Salvando comentário no banco:', { usuarioId, resenhaId, texto: texto?.substring(0, 50) });
  
  try {
    const comentario = await prisma.comentario.create({
      data: {
        usuarioId: parseInt(usuarioId),
        resenhaId: parseInt(resenhaId),
        texto
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            fotoPerfil: true
          }
        }
      }
    });
    
    console.log('✅ Comentário salvo com ID:', comentario.id);
    return comentario;
  } catch (error) {
    console.error('❌ Erro ao criar comentário no Prisma:', error);
    throw error;
  }
}

async function getComentariosByResenhaId(resenhaId) {
  console.log('🔍 Buscando comentários para resenhaId:', resenhaId);
  
  try {
    const comentarios = await prisma.comentario.findMany({
      where: { resenhaId: parseInt(resenhaId) },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            fotoPerfil: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('✅ Encontrados', comentarios.length, 'comentários');
    return comentarios;
  } catch (error) {
    console.error('❌ Erro ao buscar comentários:', error);
    throw error;
  }
}

async function deleteComentario(comentarioId) {
  console.log('🗑️  Deletando comentário ID:', comentarioId);
  
  try {
    const resultado = await prisma.comentario.delete({
      where: { id: parseInt(comentarioId) }
    });
    
    console.log('✅ Comentário deletado');
    return resultado;
  } catch (error) {
    console.error('❌ Erro ao deletar comentário:', error);
    throw error;
  }
}

async function getComentarioById(comentarioId) {
  return prisma.comentario.findUnique({
    where: { id: parseInt(comentarioId) },
    include: {
      usuario: {
        select: {
          id: true,
          nome: true,
          fotoPerfil: true
        }
      }
    }
  });
}

// Funções de Admin para Comentários
async function getAllComentariosAdmin() {
  console.log('📋 Buscando todos os comentários (admin)');
  
  try {
    const comentarios = await prisma.comentario.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            fotoPerfil: true
          }
        },
        resenha: {
          select: {
            id: true,
            titulo: true,
            livro: {
              select: {
                titulo: true
              }
            }
          }
        },
        denuncias: {
          select: {
            id: true,
            motivo: true,
            descricao: true,
            status: true,
            createdAt: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            denuncias: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('✅ Encontrados', comentarios.length, 'comentários');
    return comentarios;
  } catch (error) {
    console.error('❌ Erro ao buscar comentários:', error);
    throw error;
  }
}

async function updateComentarioAdmin(comentarioId, texto) {
  console.log('✏️  Atualizando comentário ID:', comentarioId);
  
  try {
    const comentario = await prisma.comentario.update({
      where: { id: parseInt(comentarioId) },
      data: { texto },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            fotoPerfil: true
          }
        }
      }
    });
    
    console.log('✅ Comentário atualizado com sucesso');
    return comentario;
  } catch (error) {
    console.error('❌ Erro ao atualizar comentário:', error);
    throw error;
  }
}

async function deleteComentarioAdmin(comentarioId) {
  console.log('🗑️  Deletando comentário ID:', comentarioId, '(admin)');
  
  try {
    // Deletar denúncias associadas
    await prisma.denunciaComentario.deleteMany({
      where: { comentarioId: parseInt(comentarioId) }
    });

    const resultado = await prisma.comentario.delete({
      where: { id: parseInt(comentarioId) }
    });
    
    console.log('✅ Comentário deletado com sucesso por admin');
    return resultado;
  } catch (error) {
    console.error('❌ Erro ao deletar comentário:', error);
    throw error;
  }
}

// Funções de Denúncias de Comentários
async function criarDenunciaComentario(usuarioId, comentarioId, motivo, descricao) {
  console.log('🚩 Recebi denúncia:', { usuarioId, comentarioId, motivo });
  
  try {
    const denuncia = await prisma.denunciaComentario.create({
      data: {
        usuarioId: parseInt(usuarioId),
        comentarioId: parseInt(comentarioId),
        motivo,
        descricao: descricao || null
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        comentario: {
          select: {
            id: true,
            texto: true,
            usuario: {
              select: {
                nome: true
              }
            }
          }
        }
      }
    });
    
    console.log('✅ Denúncia criada com ID:', denuncia.id);
    return denuncia;
  } catch (error) {
    console.error('❌ Erro ao criar denúncia:', error);
    throw error;
  }
}

async function getDenunciasComentarios(status = null) {
  console.log('📋 Buscando denúncias:', { status });
  
  try {
    const where = status ? { status } : {};
    
    const denuncias = await prisma.denunciaComentario.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        comentario: {
          select: {
            id: true,
            texto: true,
            usuario: {
              select: {
                nome: true
              }
            },
            resenha: {
              select: {
                titulo: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('✅ Encontradas', denuncias.length, 'denúncias');
    return denuncias;
  } catch (error) {
    console.error('❌ Erro ao buscar denúncias:', error);
    throw error;
  }
}

async function atualizarStatusDenuncia(denunciaId, status) {
  console.log('🔄 Atualizando denúncia ID:', denunciaId, 'status:', status);
  
  try {
    const denuncia = await prisma.denunciaComentario.update({
      where: { id: parseInt(denunciaId) },
      data: { status },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true
          }
        },
        comentario: {
          select: {
            id: true,
            texto: true
          }
        }
      }
    });
    
    console.log('✅ Denúncia atualizada com status:', status);
    return denuncia;
  } catch (error) {
    console.error('❌ Erro ao atualizar denúncia:', error);
    throw error;
  }
}

async function deleteDenunciaComentario(denunciaId) {
  console.log('🗑️  Removendo denúncia ID:', denunciaId);

  try {
    const denuncia = await prisma.denunciaComentario.delete({
      where: { id: parseInt(denunciaId) }
    });

    console.log('✅ Denúncia removida com sucesso');
    return denuncia;
  } catch (error) {
    console.error('❌ Erro ao remover denúncia:', error);
    throw error;
  }
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
  deleteResenha,
  addFavorito,
  removeFavorito,
  getFavoritosByUsuarioId,
  checkFavorito,
  addCurtidaResenha,
  removeCurtidaResenha,
  checkCurtidaResenha,
  searchLivros,
  createComentario,
  getComentariosByResenhaId,
  deleteComentario,
  getComentarioById,
  getAllComentariosAdmin,
  updateComentarioAdmin,
  deleteComentarioAdmin,
  criarDenunciaComentario,
  getDenunciasComentarios,
  atualizarStatusDenuncia,
  deleteDenunciaComentario
};
