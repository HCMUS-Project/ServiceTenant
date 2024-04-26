/*
  Warnings:

  - The primary key for the `CartItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `image` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[cart_id,product_id]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_productId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_pkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cart_id_product_id_key" ON "CartItem"("cart_id", "product_id");

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
