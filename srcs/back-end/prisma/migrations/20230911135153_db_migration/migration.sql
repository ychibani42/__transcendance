-- DropForeignKey
ALTER TABLE "Muted" DROP CONSTRAINT "Muted_channelId_fkey";

-- CreateTable
CREATE TABLE "_chan/muted" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_chan/muted_AB_unique" ON "_chan/muted"("A", "B");

-- CreateIndex
CREATE INDEX "_chan/muted_B_index" ON "_chan/muted"("B");

-- AddForeignKey
ALTER TABLE "_chan/muted" ADD CONSTRAINT "_chan/muted_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chan/muted" ADD CONSTRAINT "_chan/muted_B_fkey" FOREIGN KEY ("B") REFERENCES "Muted"("id") ON DELETE CASCADE ON UPDATE CASCADE;
