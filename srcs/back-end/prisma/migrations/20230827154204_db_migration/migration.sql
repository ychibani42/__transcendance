/*
  Warnings:

  - Added the required column `dm` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "dm" BOOLEAN NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
