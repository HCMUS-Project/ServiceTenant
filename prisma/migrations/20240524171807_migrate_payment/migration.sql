/*
  Warnings:

  - You are about to drop the column `secureSecret` on the `VNPayConfig` table. All the data in the column will be lost.
  - You are about to drop the column `tmnCode` on the `VNPayConfig` table. All the data in the column will be lost.
  - You are about to drop the column `vnpayHost` on the `VNPayConfig` table. All the data in the column will be lost.
  - Added the required column `secure_secret` to the `VNPayConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmn_code` to the `VNPayConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vnpay_host` to the `VNPayConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VNPayConfig" DROP COLUMN "secureSecret",
DROP COLUMN "tmnCode",
DROP COLUMN "vnpayHost",
ADD COLUMN     "secure_secret" TEXT NOT NULL,
ADD COLUMN     "tmn_code" TEXT NOT NULL,
ADD COLUMN     "vnpay_host" TEXT NOT NULL;
