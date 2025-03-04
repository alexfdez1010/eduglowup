-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('Video', 'Text', 'File', 'Url');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "type" "DocumentType" NOT NULL DEFAULT 'Text';
