/*
  Warnings:

  - You are about to drop the column `tenant_id` on the `Product` table. All the data in the column will be lost.
  - Added the required column `domain` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "domain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "tenant_id";
