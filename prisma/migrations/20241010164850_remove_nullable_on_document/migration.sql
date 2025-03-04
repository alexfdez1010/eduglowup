/*
  Warnings:

  - Made the column `ownerId` on table `DocumentSummary` required. This step will fail if there are existing NULL values in that column.
  - Made the column `language` on table `DocumentSummary` required. This step will fail if there are existing NULL values in that column.

*/

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "ownerId" SET NOT NULL,
ALTER COLUMN "language" SET NOT NULL;
