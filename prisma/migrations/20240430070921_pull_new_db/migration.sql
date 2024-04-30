/*
  Warnings:

  - You are about to drop the column `status` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `product_ids` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `product_quantities` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Voucher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[domain,user_id]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[domain,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[domain,name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domain` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `CartItem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `domain` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_after_voucher` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stage` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Voucher" DROP CONSTRAINT "Voucher_categoryId_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Product_name_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "status",
ADD COLUMN     "domain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "domain" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "product_ids",
DROP COLUMN "product_quantities",
DROP COLUMN "status",
ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "price_after_voucher" DECIMAL(19,2) NOT NULL,
ADD COLUMN     "stage" TEXT NOT NULL,
ADD COLUMN     "voucher_discount" DECIMAL(19,2),
ADD COLUMN     "voucher_id" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "domain" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "number_rating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "domain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "categoryId",
ADD COLUMN     "domain" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_order_id_product_id_key" ON "OrderItem"("order_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_domain_user_id_key" ON "Cart"("domain", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Category_domain_name_key" ON "Category"("domain", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_domain_name_key" ON "Product"("domain", "name");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
