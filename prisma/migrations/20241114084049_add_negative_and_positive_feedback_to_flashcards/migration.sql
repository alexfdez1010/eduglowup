-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "negativeFeedback" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "positiveFeedback" INTEGER NOT NULL DEFAULT 0;
