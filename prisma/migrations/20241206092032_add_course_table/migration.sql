-- CreateEnum
CREATE TYPE "CourseState" AS ENUM ('NotPublished', 'InReview', 'Published');

-- CreateTable
CREATE TABLE "Course" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "price" INTEGER,
    "useSmartPricing" BOOLEAN NOT NULL,
    "imageUrl" TEXT,
    "state" "CourseState" NOT NULL DEFAULT 'NotPublished',
    "ownerId" UUID NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
