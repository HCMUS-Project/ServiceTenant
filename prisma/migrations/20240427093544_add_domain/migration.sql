/*
  Warnings:

  - Added the required column `domain` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "domain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "domain" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "domain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "domain" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "domain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "domain" TEXT NOT NULL;
