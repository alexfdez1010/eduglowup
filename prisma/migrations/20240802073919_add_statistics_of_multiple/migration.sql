-- AlterTable
ALTER TABLE "StatisticsSection" ADD COLUMN     "correctMultipleChoiceQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalMultipleChoiceQuestions" INTEGER NOT NULL DEFAULT 0;
