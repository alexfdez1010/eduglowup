-- AlterTable
ALTER TABLE "ConceptExplanation" ALTER COLUMN "explanation" SET DATA TYPE VARCHAR(3000);

-- AlterTable
ALTER TABLE "MultipleChoiceExplanation" ALTER COLUMN "explanation" SET DATA TYPE VARCHAR(3000);

-- AlterTable
ALTER TABLE "QuizExplanation" ALTER COLUMN "explanation" SET DATA TYPE VARCHAR(3000);

-- AlterTable
ALTER TABLE "ShortQuestionExplanation" ALTER COLUMN "explanation" SET DATA TYPE VARCHAR(3000);

-- AlterTable
ALTER TABLE "TrueFalseExplanation" ALTER COLUMN "explanation" SET DATA TYPE VARCHAR(3000);
