/*
  Warnings:

  - Added the required column `stage` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "stage" TEXT NOT NULL;
