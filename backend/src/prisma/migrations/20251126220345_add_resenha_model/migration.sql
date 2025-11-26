-- CreateTable
CREATE TABLE "Resenha" (
    "id" SERIAL NOT NULL,
    "livroId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "textoResumo" TEXT NOT NULL,
    "textoCompleto" TEXT NOT NULL,
    "avaliacao" DOUBLE PRECISION NOT NULL,
    "trechosMarcantes" TEXT[],
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resenha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resenha_livroId_idx" ON "Resenha"("livroId");

-- CreateIndex
CREATE INDEX "Resenha_usuarioId_idx" ON "Resenha"("usuarioId");

-- AddForeignKey
ALTER TABLE "Resenha" ADD CONSTRAINT "Resenha_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resenha" ADD CONSTRAINT "Resenha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
