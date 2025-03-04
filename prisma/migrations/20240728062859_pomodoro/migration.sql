-- AlterTable
ALTER TABLE "Configuration" ADD COLUMN     "minutesRest" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "minutesWork" INTEGER NOT NULL DEFAULT 25,
ADD COLUMN     "usesPomodoro" BOOLEAN NOT NULL DEFAULT true;
