-- CreateTable
CREATE TABLE "AvaliacaoResenha" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "resenhaId" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvaliacaoResenha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvaliacaoResenha_usuarioId_resenhaId_key" ON "AvaliacaoResenha"("usuarioId", "resenhaId");

-- CreateIndex
CREATE INDEX "AvaliacaoResenha_usuarioId_idx" ON "AvaliacaoResenha"("usuarioId");

-- CreateIndex
CREATE INDEX "AvaliacaoResenha_resenhaId_idx" ON "AvaliacaoResenha"("resenhaId");

-- AddForeignKey
ALTER TABLE "AvaliacaoResenha" ADD CONSTRAINT "AvaliacaoResenha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoResenha" ADD CONSTRAINT "AvaliacaoResenha_resenhaId_fkey" FOREIGN KEY ("resenhaId") REFERENCES "Resenha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
