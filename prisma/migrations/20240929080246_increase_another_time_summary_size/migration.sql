-- AlterTable
ALTER TABLE "Part" ALTER COLUMN "summary" SET DATA TYPE VARCHAR(5000);

-- Remove all questions from True False, Quiz and Multiple Choice (we have changed the algorithm to generate questions)
DELETE FROM "QuizQuestion";
DELETE FROM "MultipleChoiceQuestion";
DELETE FROM "TrueFalseQuestion";