-- CreateTable
CREATE TABLE "Livro" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "editora" TEXT NOT NULL,
    "paginas" INTEGER NOT NULL,
    "isbn" TEXT,
    "categoria" TEXT,
    "sinopse" TEXT,
    "idioma" TEXT NOT NULL DEFAULT 'Português',
    "edicao" TEXT,
    "fotoCapa" TEXT NOT NULL,
    "galeria" TEXT[],
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Livro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Livro_isbn_key" ON "Livro"("isbn");
