DELETE FROM "Reward" where "documentId" is null and type IN ('DocumentCorrect', 'DocumentTotal');

-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_documentId_fkey";

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
