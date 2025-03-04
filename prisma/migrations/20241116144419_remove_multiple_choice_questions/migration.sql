/*
  Warnings:

  - You are about to drop the column `correctMultipleChoiceQuestions` on the `StatisticsSection` table. All the data in the column will be lost.
  - You are about to drop the column `totalMultipleChoiceQuestions` on the `StatisticsSection` table. All the data in the column will be lost.
  - You are about to drop the `MultipleChoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MultipleChoiceExplanation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MultipleChoiceQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MultipleChoice" DROP CONSTRAINT "MultipleChoice_questionId_fkey";

-- DropForeignKey
ALTER TABLE "MultipleChoiceQuestion" DROP CONSTRAINT "MultipleChoiceQuestion_sectionId_fkey";

-- AlterTable
ALTER TABLE "StatisticsSection" DROP COLUMN "correctMultipleChoiceQuestions",
DROP COLUMN "totalMultipleChoiceQuestions";

-- DropTable
DROP TABLE "MultipleChoice";

-- DropTable
DROP TABLE "MultipleChoiceExplanation";

-- DropTable
DROP TABLE "MultipleChoiceQuestion";
