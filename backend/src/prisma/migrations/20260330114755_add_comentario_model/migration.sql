-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "resenhaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comentario_resenhaId_idx" ON "Comentario"("resenhaId");

-- CreateIndex
CREATE INDEX "Comentario_usuarioId_idx" ON "Comentario"("usuarioId");

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_resenhaId_fkey" FOREIGN KEY ("resenhaId") REFERENCES "Resenha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
