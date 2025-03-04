-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('DocumentCorrect', 'DocumentTotal', 'FirstExercise', 'FirstQuiz', 'FirstTrueFalse', 'AllCorrectQuiz', 'AllCorrectConcepts', 'UserCorrect', 'UserTotal');

-- CreateTable
CREATE TABLE "Reward" (
    "id" UUID NOT NULL,
    "money" INTEGER NOT NULL,
    "goal" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "fulfilled" BOOLEAN NOT NULL DEFAULT false,
    "type" "RewardType" NOT NULL,
    "userId" UUID NOT NULL,
    "documentId" UUID,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reward_userId_idx" ON "Reward" USING HASH ("userId");
CREATE INDEX "Reward_userId_fulfilled_idx" ON "Reward" USING BTREE ("userId", "fulfilled");

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
