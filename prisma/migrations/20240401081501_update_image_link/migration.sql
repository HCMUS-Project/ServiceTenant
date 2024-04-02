/*
  Warnings:

  - You are about to alter the column `total_price` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,2)`.
  - You are about to alter the column `total_price` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,2)`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,2)`.
  - You are about to alter the column `rating` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,1)`.
  - You are about to alter the column `rating` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,1)`.
  - You are about to alter the column `max_discount` on the `Voucher` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,2)`.
  - You are about to alter the column `min_app_value` on the `Voucher` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,2)`.
  - You are about to alter the column `discount_percent` on the `Voucher` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(19,2)`.
  - Added the required column `image` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "total_price" SET DATA TYPE DECIMAL(19,2);

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "total_price" SET DATA TYPE DECIMAL(19,2);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(19,2),
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(19,1);

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET DATA TYPE DECIMAL(19,1);

-- AlterTable
ALTER TABLE "Voucher" ALTER COLUMN "max_discount" SET DATA TYPE DECIMAL(19,2),
ALTER COLUMN "min_app_value" SET DATA TYPE DECIMAL(19,2),
ALTER COLUMN "discount_percent" SET DATA TYPE DECIMAL(19,2);
