-- CreateTable
CREATE TABLE "VNPayConfig" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "tmnCode" TEXT NOT NULL,
    "secureSecret" TEXT NOT NULL,
    "vnpayHost" TEXT NOT NULL,

    CONSTRAINT "VNPayConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VNPayConfig_id_key" ON "VNPayConfig"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VNPayConfig_tenant_id_key" ON "VNPayConfig"("tenant_id");

-- AddForeignKey
ALTER TABLE "VNPayConfig" ADD CONSTRAINT "VNPayConfig_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
