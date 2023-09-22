-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Banned" DROP CONSTRAINT "Banned_userId_fkey";

-- DropForeignKey
ALTER TABLE "Muted" DROP CONSTRAINT "Muted_userId_fkey";

-- CreateTable
CREATE TABLE "_user/muted" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_user/admin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_user/banned" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_user/muted_AB_unique" ON "_user/muted"("A", "B");

-- CreateIndex
CREATE INDEX "_user/muted_B_index" ON "_user/muted"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_user/admin_AB_unique" ON "_user/admin"("A", "B");

-- CreateIndex
CREATE INDEX "_user/admin_B_index" ON "_user/admin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_user/banned_AB_unique" ON "_user/banned"("A", "B");

-- CreateIndex
CREATE INDEX "_user/banned_B_index" ON "_user/banned"("B");

-- AddForeignKey
ALTER TABLE "_user/muted" ADD CONSTRAINT "_user/muted_A_fkey" FOREIGN KEY ("A") REFERENCES "Muted"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user/muted" ADD CONSTRAINT "_user/muted_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user/admin" ADD CONSTRAINT "_user/admin_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user/admin" ADD CONSTRAINT "_user/admin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user/banned" ADD CONSTRAINT "_user/banned_A_fkey" FOREIGN KEY ("A") REFERENCES "Banned"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user/banned" ADD CONSTRAINT "_user/banned_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
