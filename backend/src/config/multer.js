const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar pasta uploads se não existir
const uploadBooksDir = path.join(__dirname, '../../uploads/books');
if (!fs.existsSync(uploadBooksDir)) {
  fs.mkdirSync(uploadBooksDir, { recursive: true });
}

const uploadPerfilDir = path.join(__dirname, '../../uploads/perfil');
if (!fs.existsSync(uploadPerfilDir)) {
  fs.mkdirSync(uploadPerfilDir, { recursive: true });
}

// Configuração de storage para livros
const storageBooks = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadBooksDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `book-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configuração de storage para perfil
const storagePerfil = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPerfilDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `perfil-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
  }
};

// Configuração do multer para livros
const uploadBooks = multer({
  storage: storageBooks,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Configuração do multer para perfil
const uploadPerfil = multer({
  storage: storagePerfil,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = { uploadBooks, uploadPerfil };
