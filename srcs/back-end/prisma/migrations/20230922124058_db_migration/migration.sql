/*
  Warnings:

  - You are about to drop the column `username` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Banned` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Muted` table. All the data in the column will be lost.
  - You are about to drop the `_chan/admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_chan/muted` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_user/admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_user/muted` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_chan/admin" DROP CONSTRAINT "_chan/admin_A_fkey";

-- DropForeignKey
ALTER TABLE "_chan/admin" DROP CONSTRAINT "_chan/admin_B_fkey";

-- DropForeignKey
ALTER TABLE "_chan/muted" DROP CONSTRAINT "_chan/muted_A_fkey";

-- DropForeignKey
ALTER TABLE "_chan/muted" DROP CONSTRAINT "_chan/muted_B_fkey";

-- DropForeignKey
ALTER TABLE "_user/admin" DROP CONSTRAINT "_user/admin_A_fkey";

-- DropForeignKey
ALTER TABLE "_user/admin" DROP CONSTRAINT "_user/admin_B_fkey";

-- DropForeignKey
ALTER TABLE "_user/muted" DROP CONSTRAINT "_user/muted_A_fkey";

-- DropForeignKey
ALTER TABLE "_user/muted" DROP CONSTRAINT "_user/muted_B_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "username";

-- AlterTable
ALTER TABLE "Banned" DROP COLUMN "username";

-- AlterTable
ALTER TABLE "Muted" DROP COLUMN "username";

-- DropTable
DROP TABLE "_chan/admin";

-- DropTable
DROP TABLE "_chan/muted";

-- DropTable
DROP TABLE "_user/admin";

-- DropTable
DROP TABLE "_user/muted";

-- AddForeignKey
ALTER TABLE "Muted" ADD CONSTRAINT "Muted_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Muted" ADD CONSTRAINT "Muted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
