-- CreateTable
CREATE TABLE "LeituraUsuario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "livroId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeituraUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeituraUsuario_usuarioId_idx" ON "LeituraUsuario"("usuarioId");

-- CreateIndex
CREATE INDEX "LeituraUsuario_livroId_idx" ON "LeituraUsuario"("livroId");

-- CreateIndex
CREATE INDEX "LeituraUsuario_status_idx" ON "LeituraUsuario"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LeituraUsuario_usuarioId_livroId_key" ON "LeituraUsuario"("usuarioId", "livroId");

-- AddForeignKey
ALTER TABLE "LeituraUsuario" ADD CONSTRAINT "LeituraUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeituraUsuario" ADD CONSTRAINT "LeituraUsuario_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro"("id") ON DELETE CASCADE ON UPDATE CASCADE;