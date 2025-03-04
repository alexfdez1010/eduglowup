/*
  Warnings:

  - You are about to drop the `ExtendedSummary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SharedDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TokenShare` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExtendedSummary" DROP CONSTRAINT "ExtendedSummary_partId_fkey";

-- DropForeignKey
ALTER TABLE "SharedDocument" DROP CONSTRAINT "SharedDocument_documentId_fkey";

-- DropForeignKey
ALTER TABLE "SharedDocument" DROP CONSTRAINT "SharedDocument_userId_fkey";

-- DropForeignKey
ALTER TABLE "TokenShare" DROP CONSTRAINT "TokenShare_documentId_fkey";

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "filename" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Part" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "summary" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "ExtendedSummary";

-- DropTable
DROP TABLE "SharedDocument";

-- DropTable
DROP TABLE "TokenShare";
