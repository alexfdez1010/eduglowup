-- AlterTable
ALTER TABLE "ValidationTest" ADD COLUMN     "age" VARCHAR(15) NOT NULL DEFAULT '',
ADD COLUMN     "hasAnswered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile" VARCHAR(30) NOT NULL DEFAULT '',
ADD COLUMN     "studyLevel" VARCHAR(30) NOT NULL DEFAULT '',
ADD COLUMN     "whatNeedForExams" VARCHAR(1000) NOT NULL DEFAULT '',
ADD COLUMN     "whenHaveExams" VARCHAR(1000) NOT NULL DEFAULT '',
ALTER COLUMN "leftAnyFunctionality" SET DEFAULT '',
ALTER COLUMN "whatDoYouLike" SET DEFAULT '',
ALTER COLUMN "whatDoYouDislike" SET DEFAULT '',
ALTER COLUMN "comment" SET DEFAULT '';
