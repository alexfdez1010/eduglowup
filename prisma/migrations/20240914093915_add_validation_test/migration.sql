-- CreateTable
CREATE TABLE "ValidationTest" (
    "userId" UUID NOT NULL,
    "interesting" INTEGER NOT NULL,
    "payForIt" BOOLEAN NOT NULL,
    "leftAnyFunctionality" TEXT NOT NULL,
    "whatDoYouLike" TEXT NOT NULL,
    "whatDoYouDislike" TEXT NOT NULL,
    "recommend" INTEGER NOT NULL,
    "isUseful" BOOLEAN NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "ValidationTest_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "ValidationTest" ADD CONSTRAINT "ValidationTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
