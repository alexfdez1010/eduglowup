-- CreateTable
CREATE TABLE "MultipleChoiceQuestion" (
    "id" UUID NOT NULL,
    "text" VARCHAR(250) NOT NULL,
    "sectionId" UUID NOT NULL,

    CONSTRAINT "MultipleChoiceQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultipleChoice" (
    "id" UUID NOT NULL,
    "text" VARCHAR(250) NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" UUID NOT NULL,

    CONSTRAINT "MultipleChoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MultipleChoiceQuestion_sectionId_idx" ON "MultipleChoiceQuestion" USING HASH ("sectionId");

-- CreateIndex
CREATE INDEX "MultipleChoice_questionId_idx" ON "MultipleChoice" USING HASH ("questionId");

-- AddForeignKey
ALTER TABLE "MultipleChoiceQuestion" ADD CONSTRAINT "MultipleChoiceQuestion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultipleChoice" ADD CONSTRAINT "MultipleChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MultipleChoiceQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
