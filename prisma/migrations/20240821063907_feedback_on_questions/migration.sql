/*
  Warnings:

  - The values [MINDMAP] on the enum `BlockType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
DELETE FROM "Block" WHERE "type" = 'MINDMAP' or "type" = 'SUMMARY';
CREATE TYPE "BlockType_new" AS ENUM ('BUDDY', 'USER', 'QUIZ', 'MULTIPLE', 'SHORT', 'TRUE_FALSE', 'CONCEPT');
ALTER TABLE "Block" ALTER COLUMN "type" TYPE "BlockType_new" USING ("type"::text::"BlockType_new");
ALTER TYPE "BlockType" RENAME TO "BlockType_old";
ALTER TYPE "BlockType_new" RENAME TO "BlockType";
DROP TYPE "BlockType_old";
COMMIT;

-- AlterTable
ALTER TABLE "MultipleChoiceQuestion" ADD COLUMN     "negativeFeedback" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "positiveFeedback" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "negativeFeedback" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "positiveFeedback" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ShortQuestion" ADD COLUMN     "negativeFeedback" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "positiveFeedback" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TrueFalseQuestion" ADD COLUMN     "negativeFeedback" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "positiveFeedback" INTEGER NOT NULL DEFAULT 0;
