/*
  Warnings:

  - A unique constraint covering the columns `[domain,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[domain,name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Category_domain_name_key" ON "Category"("domain", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_domain_name_key" ON "Product"("domain", "name");
