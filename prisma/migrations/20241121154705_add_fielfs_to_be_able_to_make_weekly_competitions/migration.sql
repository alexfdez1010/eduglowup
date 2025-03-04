-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friendCode" CHAR(10);

-- CreateTable
CREATE TABLE "WeekPerformance" (
    "userId" UUID NOT NULL,
    "week" CHAR(8) NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "WeekPerformance_pkey" PRIMARY KEY ("week","userId")
);

-- CreateTable
CREATE TABLE "Friend" (
    "friendLowestId" UUID NOT NULL,
    "friendGreatestId" UUID NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("friendLowestId","friendGreatestId")
);

-- CreateIndex
CREATE INDEX "WeekPerformance_week_idx" ON "WeekPerformance" USING HASH ("week");

-- CreateIndex
CREATE INDEX "Friend_friendLowestId_idx" ON "Friend" USING HASH ("friendLowestId");

-- CreateIndex
CREATE INDEX "Friend_friendGreatestId_idx" ON "Friend" USING HASH ("friendGreatestId");

-- CreateIndex
CREATE INDEX "User_friendCode_idx" ON "User" USING HASH ("friendCode");

-- AddForeignKey
ALTER TABLE "WeekPerformance" ADD CONSTRAINT "WeekPerformance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendLowestId_fkey" FOREIGN KEY ("friendLowestId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendGreatestId_fkey" FOREIGN KEY ("friendGreatestId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
