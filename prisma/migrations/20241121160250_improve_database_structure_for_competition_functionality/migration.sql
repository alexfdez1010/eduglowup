/*
  Warnings:

  - The primary key for the `Friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `friendGreatestId` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `friendLowestId` on the `Friend` table. All the data in the column will be lost.
  - Added the required column `friendId` to the `Friend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friendGreatestId_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friendLowestId_fkey";

-- DropIndex
DROP INDEX "Friend_friendGreatestId_idx";

-- DropIndex
DROP INDEX "Friend_friendLowestId_idx";

-- AlterTable
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_pkey",
DROP COLUMN "friendGreatestId",
DROP COLUMN "friendLowestId",
ADD COLUMN     "friendId" UUID NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "Friend_pkey" PRIMARY KEY ("userId", "friendId");

-- CreateIndex
CREATE INDEX "Friend_userId_idx" ON "Friend" USING HASH ("userId");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
