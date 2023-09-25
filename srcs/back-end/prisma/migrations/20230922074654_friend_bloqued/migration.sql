/*
  Warnings:

  - You are about to drop the column `duration` on the `BlockedU` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Friends` table. All the data in the column will be lost.
  - Added the required column `userBloqued` to the `BlockedU` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userFriend` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlockedU" DROP COLUMN "duration",
ADD COLUMN     "userBloqued" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "duration",
ADD COLUMN     "userFriend" INTEGER NOT NULL;
