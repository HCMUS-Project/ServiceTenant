/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Voucher` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Voucher" DROP CONSTRAINT "Voucher_categoryId_fkey";

-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "categoryId";
