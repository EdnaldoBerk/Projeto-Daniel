-- CreateTable
CREATE TABLE "CurtidaResenha" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "resenhaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurtidaResenha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CurtidaResenha_usuarioId_idx" ON "CurtidaResenha"("usuarioId");

-- CreateIndex
CREATE INDEX "CurtidaResenha_resenhaId_idx" ON "CurtidaResenha"("resenhaId");

-- CreateIndex
CREATE UNIQUE INDEX "CurtidaResenha_usuarioId_resenhaId_key" ON "CurtidaResenha"("usuarioId", "resenhaId");

-- AddForeignKey
ALTER TABLE "CurtidaResenha" ADD CONSTRAINT "CurtidaResenha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurtidaResenha" ADD CONSTRAINT "CurtidaResenha_resenhaId_fkey" FOREIGN KEY ("resenhaId") REFERENCES "Resenha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
