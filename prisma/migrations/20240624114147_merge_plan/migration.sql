/*
  Warnings:

  - You are about to drop the column `value` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `plan_name` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_value` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "value",
ADD COLUMN     "plan_name" TEXT NOT NULL,
ADD COLUMN     "total_value" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Plan" (
    "name" TEXT NOT NULL,
    "price_per_month" DOUBLE PRECISION NOT NULL,
    "limit_of_month" INTEGER NOT NULL,
    "limit_of_services" INTEGER NOT NULL,
    "limit_of_employees" INTEGER NOT NULL,
    "limit_of_products" INTEGER NOT NULL,
    "fee_percent_per_transaction" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_plan_name_fkey" FOREIGN KEY ("plan_name") REFERENCES "Plan"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
