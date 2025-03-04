-- CreateTable
CREATE TABLE "UserStatistics" (
    "userId" UUID NOT NULL,
    "minutesOnApp" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserStatistics_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserStatistics" ADD CONSTRAINT "UserStatistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
