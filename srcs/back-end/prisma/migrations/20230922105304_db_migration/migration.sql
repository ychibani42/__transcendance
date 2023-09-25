/*
  Warnings:

  - Added the required column `username` to the `Banned` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Muted` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banned" ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Muted" ADD COLUMN     "username" TEXT NOT NULL;
