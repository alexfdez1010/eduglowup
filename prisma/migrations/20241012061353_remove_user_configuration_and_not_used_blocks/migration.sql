/*
  Warnings:

  - The values [BUDDY,USER] on the enum `BlockType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `buddyId` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `preferences` on the `Configuration` table. All the data in the column will be lost.

*/
DELETE FROM "Block" WHERE "type" = 'BUDDY' OR "type" = 'USER';
-- AlterEnum
BEGIN;
CREATE TYPE "BlockType_new" AS ENUM ('QUIZ', 'MULTIPLE', 'SHORT', 'TRUE_FALSE', 'CONCEPT');
ALTER TABLE "Block" ALTER COLUMN "type" TYPE "BlockType_new" USING ("type"::text::"BlockType_new");
ALTER TYPE "BlockType" RENAME TO "BlockType_old";
ALTER TYPE "BlockType_new" RENAME TO "BlockType";
DROP TYPE "BlockType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "buddyId",
DROP COLUMN "preferences";
