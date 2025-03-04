/*
  Warnings:

  - The primary key for the `MessagePart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `MessagePart` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MessagePart_partId_idx";

-- DropIndex
DROP INDEX "MessageSession_sessionId_idx";

-- AlterTable
ALTER TABLE "MessagePart" DROP CONSTRAINT "MessagePart_pkey",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "MessagePart_pkey" PRIMARY KEY ("userId", "partId", "order");

-- CreateIndex
CREATE INDEX "MessagePart_userId_partId_order_idx" ON "MessagePart"("userId", "partId", "order");

-- CreateIndex
CREATE INDEX "MessageSession_sessionId_order_idx" ON "MessageSession"("sessionId", "order");
