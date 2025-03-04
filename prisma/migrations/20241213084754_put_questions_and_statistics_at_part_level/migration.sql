/*
  Warnings:

  - You are about to drop the column `sectionId` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `ShortQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `TrueFalseQuestion` table. All the data in the column will be lost.
  - You are about to drop the `StatisticsSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN "partId" UUID;

-- AlterTable
ALTER TABLE "ShortQuestion" ADD COLUMN "partId" UUID;

-- AlterTable
ALTER TABLE "TrueFalseQuestion" ADD COLUMN "partId" UUID;

-- Update partId for existing questions
UPDATE "QuizQuestion" q
SET "partId" = s."partId"
FROM "Section" s
WHERE q."sectionId" = s."id";

UPDATE "ShortQuestion" sq
SET "partId" = s."partId"
FROM "Section" s
WHERE sq."sectionId" = s."id";

UPDATE "TrueFalseQuestion" tf
SET "partId" = s."partId"
FROM "Section" s
WHERE tf."sectionId" = s."id";

-- DropForeignKey
ALTER TABLE "QuizQuestion" DROP CONSTRAINT "QuizQuestion_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "ShortQuestion" DROP CONSTRAINT "ShortQuestion_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "StatisticsSection" DROP CONSTRAINT "StatisticsSection_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "StatisticsSection" DROP CONSTRAINT "StatisticsSection_userId_fkey";

-- DropForeignKey
ALTER TABLE "TrueFalseQuestion" DROP CONSTRAINT "TrueFalseQuestion_sectionId_fkey";

-- DropIndex
DROP INDEX "QuizQuestion_sectionId_idx";

-- DropIndex
DROP INDEX "ShortQuestion_sectionId_idx";

-- DropIndex
DROP INDEX "TrueFalseQuestion_sectionId_idx";

ALTER TABLE "QuizQuestion" DROP COLUMN "sectionId";

ALTER TABLE "ShortQuestion" DROP COLUMN "sectionId";

ALTER TABLE "TrueFalseQuestion" DROP COLUMN "sectionId";

-- AlterTable
ALTER TABLE "StatisticsPart" ADD COLUMN     "correctQuizQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "correctShortQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "correctTrueFalseQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalQuizQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalShortQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalTrueFalseQuestions" INTEGER NOT NULL DEFAULT 0;

-- Update StatisticsPart with aggregated data from StatisticsSection
UPDATE "StatisticsPart" sp
SET "correctQuizQuestions" = subquery.sum_correct_quiz,
    "correctShortQuestions" = subquery.sum_correct_short,
    "correctTrueFalseQuestions" = subquery.sum_correct_true_false,
    "totalQuizQuestions" = subquery.sum_total_quiz,
    "totalShortQuestions" = subquery.sum_total_short,
    "totalTrueFalseQuestions" = subquery.sum_total_true_false
FROM (
    SELECT s."partId",
           SUM(ss."correctQuizQuestions") as sum_correct_quiz,
           SUM(ss."correctShortQuestions") as sum_correct_short,
           SUM(ss."correctTrueFalseQuestions") as sum_correct_true_false,
           SUM(ss."totalQuizQuestions") as sum_total_quiz,
           SUM(ss."totalShortQuestions") as sum_total_short,
           SUM(ss."totalTrueFalseQuestions") as sum_total_true_false
    FROM "StatisticsSection" ss
    JOIN "Section" s ON ss."sectionId" = s."id"
    GROUP BY s."partId"
) AS subquery
WHERE sp."partId" = subquery."partId";

-- DropTable
DROP TABLE "StatisticsSection";

-- CreateIndex
CREATE INDEX "QuizQuestion_partId_idx" ON "QuizQuestion" USING HASH ("partId");

-- CreateIndex
CREATE INDEX "ShortQuestion_partId_idx" ON "ShortQuestion" USING HASH ("partId");

-- CreateIndex
CREATE INDEX "TrueFalseQuestion_partId_idx" ON "TrueFalseQuestion" USING HASH ("partId");
