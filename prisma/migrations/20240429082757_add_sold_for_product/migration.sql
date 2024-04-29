/*
  Warnings:

  - Added the required column `price_after_voucher` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "price_after_voucher" DECIMAL(19,2) NOT NULL,
ADD COLUMN     "voucher_discount" DECIMAL(19,2),
ADD COLUMN     "voucher_id" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sold" INTEGER NOT NULL DEFAULT 0;
