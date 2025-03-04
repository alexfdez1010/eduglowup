/*
  Warnings:

  - Added the required column `type` to the `MessagePart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `MessageSession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('USER', 'AI');

-- AlterTable
ALTER TABLE "MessagePart" ADD COLUMN     "type" "MessageType" NOT NULL;

-- AlterTable
ALTER TABLE "MessageSession" ADD COLUMN     "type" "MessageType" NOT NULL;

-- CreateIndex
CREATE INDEX "MessagePart_partId_idx" ON "MessagePart" USING HASH ("partId");

-- CreateIndex
CREATE INDEX "MessageSession_sessionId_idx" ON "MessageSession" USING HASH ("sessionId");
