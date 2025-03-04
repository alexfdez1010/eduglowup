/*
  Warnings:

  - Made the column `partId` on table `QuizQuestion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `partId` on table `ShortQuestion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `partId` on table `TrueFalseQuestion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "QuizQuestion" ALTER COLUMN "partId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ShortQuestion" ALTER COLUMN "partId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrueFalseQuestion" ALTER COLUMN "partId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortQuestion" ADD CONSTRAINT "ShortQuestion_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrueFalseQuestion" ADD CONSTRAINT "TrueFalseQuestion_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;
