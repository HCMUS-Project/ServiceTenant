/*
  Warnings:

  - You are about to drop the column `user_id` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[domain,user]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cart_domain_user_id_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "user_id",
ADD COLUMN     "user" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "user_id",
ADD COLUMN     "user" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "user_id",
ADD COLUMN     "user" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_domain_user_key" ON "Cart"("domain", "user");
