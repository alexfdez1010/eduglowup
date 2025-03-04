/*
  Warnings:

  - You are about to drop the column `classId` on the `DocumentSummary` table. All the data in the column will be lost.
  - You are about to drop the `StudyClass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_classParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_sessionDocuments` table. If the table is not empty, all the data it contains will be lost.
*/
DELETE FROM "StudySession";

ALTER TABLE "Document"
    ADD COLUMN "ownerId" UUID,
    ADD COLUMN "language" VARCHAR(10);

UPDATE "Document"
SET "ownerId" = "StudyClass"."ownerId",
    "language" = "StudyClass"."language"
FROM "StudyClass"
WHERE "Document"."classId" = "StudyClass"."id";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_classId_fkey";

-- DropForeignKey
ALTER TABLE "StudyClass" DROP CONSTRAINT "StudyClass_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_classParticipant" DROP CONSTRAINT "_classParticipant_A_fkey";

-- DropForeignKey
ALTER TABLE "_classParticipant" DROP CONSTRAINT "_classParticipant_B_fkey";

-- DropForeignKey
ALTER TABLE "_sessionDocuments" DROP CONSTRAINT "_sessionDocuments_A_fkey";

-- DropForeignKey
ALTER TABLE "_sessionDocuments" DROP CONSTRAINT "_sessionDocuments_B_fkey";

-- DropIndex
DROP INDEX "Document_classId_idx";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "classId";

-- AlterTable
ALTER TABLE "StudySession" ADD COLUMN "documentId" UUID;

-- DropTable
DROP TABLE "StudyClass";

-- DropTable
DROP TABLE "_classParticipant";

-- DropTable
DROP TABLE "_sessionDocuments";

-- CreateTable
CREATE TABLE "SharedDocument" (
    "userId" UUID NOT NULL,
    "documentId" UUID NOT NULL,

    CONSTRAINT "SharedDocument_pkey" PRIMARY KEY ("userId","documentId")
);

-- CreateIndex
CREATE INDEX "Document_ownerId_idx" ON "Document" USING HASH ("ownerId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedDocument" ADD CONSTRAINT "SharedDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedDocument" ADD CONSTRAINT "SharedDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
