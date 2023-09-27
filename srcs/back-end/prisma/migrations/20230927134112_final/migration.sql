-- CreateEnum
CREATE TYPE "State" AS ENUM ('Disconected', 'Online', 'Afk', 'OnGame');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT,
    "id42" INTEGER NOT NULL,
    "name" TEXT,
    "state" "State" NOT NULL DEFAULT 'Disconected',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profilefinish" BOOLEAN NOT NULL DEFAULT false,
    "otpenable" BOOLEAN NOT NULL DEFAULT false,
    "otpvalider" BOOLEAN NOT NULL DEFAULT true,
    "otpcode" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "score" INTEGER[],
    "player1" INTEGER NOT NULL,
    "player2" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "is_private" BOOLEAN NOT NULL,
    "password" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "channelName" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "dm" BOOLEAN NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DM" (
    "id" SERIAL NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "dm1" INTEGER NOT NULL,
    "dm2" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "channelId" INTEGER,
    "dmId" INTEGER,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedU" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userBloqued" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BlockedU_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friends" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userFriend" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Muted" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Muted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banned" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Banned_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_chan/user" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id42_key" ON "User"("id42");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_id_key" ON "Channel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_channelName_key" ON "Channel"("channelName");

-- CreateIndex
CREATE UNIQUE INDEX "DM_id_key" ON "DM"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedU_id_key" ON "BlockedU"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_id_key" ON "Friends"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Muted_id_key" ON "Muted"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Banned_id_key" ON "Banned"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_chan/user_AB_unique" ON "_chan/user"("A", "B");

-- CreateIndex
CREATE INDEX "_chan/user_B_index" ON "_chan/user"("B");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1_fkey" FOREIGN KEY ("player1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2_fkey" FOREIGN KEY ("player2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DM" ADD CONSTRAINT "DM_dm1_fkey" FOREIGN KEY ("dm1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DM" ADD CONSTRAINT "DM_dm2_fkey" FOREIGN KEY ("dm2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_dmId_fkey" FOREIGN KEY ("dmId") REFERENCES "DM"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedU" ADD CONSTRAINT "BlockedU_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Muted" ADD CONSTRAINT "Muted_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Muted" ADD CONSTRAINT "Muted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banned" ADD CONSTRAINT "Banned_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banned" ADD CONSTRAINT "Banned_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chan/user" ADD CONSTRAINT "_chan/user_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chan/user" ADD CONSTRAINT "_chan/user_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
