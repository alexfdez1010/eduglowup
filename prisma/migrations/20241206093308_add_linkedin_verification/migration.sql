-- CreateTable
CREATE TABLE "LinkedInVerification" (
    "userId" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,

    CONSTRAINT "LinkedInVerification_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "LinkedInVerification" ADD CONSTRAINT "LinkedInVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
