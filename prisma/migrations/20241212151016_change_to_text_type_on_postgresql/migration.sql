-- AlterTable
ALTER TABLE "Choice" ALTER COLUMN "text" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Concept" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "definition" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ConceptExplanation" ALTER COLUMN "explanation" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Flashcard" ALTER COLUMN "front" SET DATA TYPE TEXT,
ALTER COLUMN "back" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "QuizQuestion" ALTER COLUMN "text" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ShortQuestion" ALTER COLUMN "question" SET DATA TYPE TEXT,
ALTER COLUMN "rubric" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ShortQuestionExplanation" ALTER COLUMN "explanation" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TrueFalseExplanation" ALTER COLUMN "explanation" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TrueFalseQuestion" ALTER COLUMN "question" SET DATA TYPE TEXT;
