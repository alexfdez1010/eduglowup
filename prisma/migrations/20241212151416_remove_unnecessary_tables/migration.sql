/*
  Warnings:

  - You are about to drop the `Coupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CouponUsed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LinkedInVerification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ValidationTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LinkedInVerification" DROP CONSTRAINT "LinkedInVerification_userId_fkey";

-- DropForeignKey
ALTER TABLE "ValidationTest" DROP CONSTRAINT "ValidationTest_userId_fkey";

-- DropTable
DROP TABLE "Coupon";

-- DropTable
DROP TABLE "CouponUsed";

-- DropTable
DROP TABLE "LinkedInVerification";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "ValidationTest";
