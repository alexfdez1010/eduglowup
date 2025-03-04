-- AlterTable
ALTER TABLE "StatisticsPart" ADD COLUMN     "correctFlashcards" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalFlashcards" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" UUID NOT NULL,
    "front" VARCHAR(500) NOT NULL,
    "back" VARCHAR(500) NOT NULL,
    "partId" UUID NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashcardExplanation" (
    "flashcardId" UUID NOT NULL,
    "explanation" VARCHAR(3000) NOT NULL,

    CONSTRAINT "FlashcardExplanation_pkey" PRIMARY KEY ("flashcardId")
);

-- CreateIndex
CREATE INDEX "Flashcard_partId_idx" ON "Flashcard" USING HASH ("partId");

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;
