/*
  Warnings:

  - You are about to drop the column `duration` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Banned` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "duration";

-- AlterTable
ALTER TABLE "Banned" DROP COLUMN "duration";
