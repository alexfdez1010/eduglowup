-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "thresholdToGiveCertificate" INTEGER;

-- AlterTable
ALTER TABLE "_contents" ADD CONSTRAINT "_contents_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_contents_AB_unique";

-- AlterTable
ALTER TABLE "_keywords" ADD CONSTRAINT "_keywords_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_keywords_AB_unique";

-- AlterTable
ALTER TABLE "_usersWithAccess" ADD CONSTRAINT "_usersWithAccess_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_usersWithAccess_AB_unique";

-- CreateTable
CREATE TABLE "Certificate" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "courseName" TEXT NOT NULL,
    "userCompleteName" TEXT NOT NULL,
    "dateOfCompletion" TIMESTAMP(3) NOT NULL,
    "instructorName" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Certificate_userId_idx" ON "Certificate" USING HASH ("userId");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

UPDATE "Course" SET "thresholdToGiveCertificate" = 50 WHERE "thresholdToGiveCertificate" IS NULL;