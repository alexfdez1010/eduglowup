/*
  Warnings:

  - The values [MULTIPLE] on the enum `BlockType` will be removed. If these variants are still used in the database, this will fail.

*/
DELETE FROM "Block" WHERE "type" = 'MULTIPLE';
-- AlterEnum
BEGIN;
CREATE TYPE "BlockType_new" AS ENUM ('QUIZ', 'SHORT', 'TRUE_FALSE', 'CONCEPT', 'FLASHCARDS');
ALTER TABLE "Block" ALTER COLUMN "type" TYPE "BlockType_new" USING ("type"::text::"BlockType_new");
ALTER TYPE "BlockType" RENAME TO "BlockType_old";
ALTER TYPE "BlockType_new" RENAME TO "BlockType";
DROP TYPE "BlockType_old";
COMMIT;
