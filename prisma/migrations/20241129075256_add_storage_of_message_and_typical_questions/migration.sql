-- AlterTable
ALTER TABLE "Part" ADD COLUMN     "typicalQuestions" VARCHAR(300);

-- CreateTable
CREATE TABLE "MessagePart" (
    "partId" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "MessagePart_pkey" PRIMARY KEY ("partId","order")
);

-- CreateTable
CREATE TABLE "MessageSession" (
    "sessionId" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "MessageSession_pkey" PRIMARY KEY ("sessionId","order")
);

-- AddForeignKey
ALTER TABLE "MessagePart" ADD CONSTRAINT "MessagePart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageSession" ADD CONSTRAINT "MessageSession_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
