/*
  Warnings:

  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verificationToken";

-- CreateTable
CREATE TABLE "CodeOTP" (
    "userId" UUID NOT NULL,
    "code" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeOTP_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "CodeOTP" ADD CONSTRAINT "CodeOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
