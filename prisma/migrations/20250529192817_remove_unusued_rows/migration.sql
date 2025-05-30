/*
  Warnings:

  - You are about to drop the column `cancellationReason` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `carrier` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveredAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippedBy` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cancellationReason",
DROP COLUMN "cancelledAt",
DROP COLUMN "carrier",
DROP COLUMN "deliveredAt",
DROP COLUMN "shippedAt",
DROP COLUMN "shippedBy",
DROP COLUMN "trackingNumber";
