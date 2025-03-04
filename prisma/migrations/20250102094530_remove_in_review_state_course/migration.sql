/*
  Warnings:

  - The values [InReview] on the enum `CourseState` will be removed. If these variants are still used in the database, this will fail.

*/
-- Remove the "InReview" state
UPDATE "Course"
SET "state" = 'Published'
WHERE "state" = 'InReview';

-- AlterEnum
BEGIN;
CREATE TYPE "CourseState_new" AS ENUM ('NotPublished', 'Published');
ALTER TABLE "Course" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Course" ALTER COLUMN "state" TYPE "CourseState_new" USING ("state"::text::"CourseState_new");
ALTER TYPE "CourseState" RENAME TO "CourseState_old";
ALTER TYPE "CourseState_new" RENAME TO "CourseState";
DROP TYPE "CourseState_old";
ALTER TABLE "Course" ALTER COLUMN "state" SET DEFAULT 'NotPublished';
COMMIT;
