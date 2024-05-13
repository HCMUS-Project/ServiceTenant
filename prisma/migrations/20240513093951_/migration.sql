/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id]` on the table `PolicyAndTerm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenant_id]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[domain]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenant_id]` on the table `TenantProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenant_id]` on the table `ThemeConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PolicyAndTerm_tenant_id_key" ON "PolicyAndTerm"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_tenant_id_key" ON "Subscription"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_domain_key" ON "Tenant"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "TenantProfile_tenant_id_key" ON "TenantProfile"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "ThemeConfig_tenant_id_key" ON "ThemeConfig"("tenant_id");

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyAndTerm" ADD CONSTRAINT "PolicyAndTerm_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantProfile" ADD CONSTRAINT "TenantProfile_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeConfig" ADD CONSTRAINT "ThemeConfig_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
