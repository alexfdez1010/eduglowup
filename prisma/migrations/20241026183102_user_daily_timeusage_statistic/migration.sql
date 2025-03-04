/*
  Warnings:

  - The primary key for the `UserStatistics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `day` to the `UserStatistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserStatistics" DROP CONSTRAINT "UserStatistics_pkey",
ADD COLUMN     "day" TEXT NOT NULL,
ADD CONSTRAINT "UserStatistics_pkey" PRIMARY KEY ("userId", "day");
