-- CreateTable
CREATE TABLE "DenunciaComentario" (
    "id" SERIAL NOT NULL,
    "comentarioId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DenunciaComentario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DenunciaComentario_comentarioId_idx" ON "DenunciaComentario"("comentarioId");

-- CreateIndex
CREATE INDEX "DenunciaComentario_usuarioId_idx" ON "DenunciaComentario"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "DenunciaComentario_comentarioId_usuarioId_key" ON "DenunciaComentario"("comentarioId", "usuarioId");

-- AddForeignKey
ALTER TABLE "DenunciaComentario" ADD CONSTRAINT "DenunciaComentario_comentarioId_fkey" FOREIGN KEY ("comentarioId") REFERENCES "Comentario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DenunciaComentario" ADD CONSTRAINT "DenunciaComentario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
