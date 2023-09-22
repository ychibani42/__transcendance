/*
  Warnings:

  - You are about to drop the `_chan/banned` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_user/banned` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_chan/banned" DROP CONSTRAINT "_chan/banned_A_fkey";

-- DropForeignKey
ALTER TABLE "_chan/banned" DROP CONSTRAINT "_chan/banned_B_fkey";

-- DropForeignKey
ALTER TABLE "_user/banned" DROP CONSTRAINT "_user/banned_A_fkey";

-- DropForeignKey
ALTER TABLE "_user/banned" DROP CONSTRAINT "_user/banned_B_fkey";

-- DropTable
DROP TABLE "_chan/banned";

-- DropTable
DROP TABLE "_user/banned";

-- AddForeignKey
ALTER TABLE "Banned" ADD CONSTRAINT "Banned_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banned" ADD CONSTRAINT "Banned_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
