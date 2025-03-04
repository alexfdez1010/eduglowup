-- AlterTable
ALTER TABLE "Concept" ADD COLUMN     "negativeFeedback" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "positiveFeedback" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "QuizExplanation" (
    "questionId" UUID NOT NULL,
    "explanation" VARCHAR(2000) NOT NULL,

    CONSTRAINT "QuizExplanation_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "MultipleChoiceExplanation" (
    "questionId" UUID NOT NULL,
    "explanation" VARCHAR(2000) NOT NULL,

    CONSTRAINT "MultipleChoiceExplanation_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "ShortQuestionExplanation" (
    "questionId" UUID NOT NULL,
    "explanation" VARCHAR(2000) NOT NULL,

    CONSTRAINT "ShortQuestionExplanation_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "TrueFalseExplanation" (
    "questionId" UUID NOT NULL,
    "explanation" VARCHAR(2000) NOT NULL,

    CONSTRAINT "TrueFalseExplanation_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "ConceptExplanation" (
    "questionId" UUID NOT NULL,
    "explanation" VARCHAR(2000) NOT NULL,

    CONSTRAINT "ConceptExplanation_pkey" PRIMARY KEY ("questionId")
);
