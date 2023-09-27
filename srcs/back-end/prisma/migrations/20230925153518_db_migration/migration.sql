/*
  Warnings:

  - Added the required column `dmId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "dmId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "DM" (
    "id" SERIAL NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "dm1" INTEGER NOT NULL,
    "dm2" INTEGER NOT NULL,

    CONSTRAINT "DM_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DM_id_key" ON "DM"("id");

-- AddForeignKey
ALTER TABLE "DM" ADD CONSTRAINT "DM_dm1_fkey" FOREIGN KEY ("dm1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DM" ADD CONSTRAINT "DM_dm2_fkey" FOREIGN KEY ("dm2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_dmId_fkey" FOREIGN KEY ("dmId") REFERENCES "DM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
