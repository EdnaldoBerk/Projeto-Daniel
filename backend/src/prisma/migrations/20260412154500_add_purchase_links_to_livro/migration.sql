-- AddPurchaseLinksToLivro
ALTER TABLE "Livro"
ADD COLUMN "purchaseLinks" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
