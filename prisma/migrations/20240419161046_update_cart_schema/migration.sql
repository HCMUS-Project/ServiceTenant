/*
  Warnings:

  - You are about to drop the column `product_ids` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `product_quanties` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `product_quanties` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "product_ids",
DROP COLUMN "product_quanties";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "product_quanties",
ADD COLUMN     "product_quantities" INTEGER[];

-- CreateTable
CREATE TABLE "_CartToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CartToProduct_AB_unique" ON "_CartToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CartToProduct_B_index" ON "_CartToProduct"("B");

-- AddForeignKey
ALTER TABLE "_CartToProduct" ADD CONSTRAINT "_CartToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToProduct" ADD CONSTRAINT "_CartToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
