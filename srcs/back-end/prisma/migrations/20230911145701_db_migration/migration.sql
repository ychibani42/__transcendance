/*
  Warnings:

  - You are about to drop the column `adminId` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `blockedUsers` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "adminId",
DROP COLUMN "blockedUsers";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banned" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Banned_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_chan/admin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_chan/banned" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Banned_id_key" ON "Banned"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_chan/admin_AB_unique" ON "_chan/admin"("A", "B");

-- CreateIndex
CREATE INDEX "_chan/admin_B_index" ON "_chan/admin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_chan/banned_AB_unique" ON "_chan/banned"("A", "B");

-- CreateIndex
CREATE INDEX "_chan/banned_B_index" ON "_chan/banned"("B");

-- AddForeignKey
ALTER TABLE "_chan/admin" ADD CONSTRAINT "_chan/admin_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chan/admin" ADD CONSTRAINT "_chan/admin_B_fkey" FOREIGN KEY ("B") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chan/banned" ADD CONSTRAINT "_chan/banned_A_fkey" FOREIGN KEY ("A") REFERENCES "Banned"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chan/banned" ADD CONSTRAINT "_chan/banned_B_fkey" FOREIGN KEY ("B") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
