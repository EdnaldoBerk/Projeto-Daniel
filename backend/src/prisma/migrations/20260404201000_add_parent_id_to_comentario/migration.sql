-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN "parentId" INTEGER;

-- CreateIndex
CREATE INDEX "Comentario_parentId_idx" ON "Comentario"("parentId");

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comentario"("id") ON DELETE CASCADE ON UPDATE CASCADE;