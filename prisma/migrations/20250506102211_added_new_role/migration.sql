/*
  Warnings:

  - Added the required column `isApproved` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "isApproved" BOOLEAN NOT NULL;
