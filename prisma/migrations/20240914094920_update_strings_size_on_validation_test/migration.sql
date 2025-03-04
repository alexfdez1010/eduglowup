/*
  Warnings:

  - You are about to alter the column `leftAnyFunctionality` on the `ValidationTest` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `whatDoYouLike` on the `ValidationTest` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `whatDoYouDislike` on the `ValidationTest` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `comment` on the `ValidationTest` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- AlterTable
ALTER TABLE "ValidationTest" ALTER COLUMN "leftAnyFunctionality" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "whatDoYouLike" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "whatDoYouDislike" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "comment" SET DATA TYPE VARCHAR(1000);
