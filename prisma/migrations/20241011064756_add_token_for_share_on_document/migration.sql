-- CreateTable
CREATE TABLE "TokenShare" (
    "documentId" UUID NOT NULL,
    "token" UUID NOT NULL,

    CONSTRAINT "TokenShare_pkey" PRIMARY KEY ("documentId")
);

-- CreateIndex
CREATE INDEX "TokenShare_token_idx" ON "TokenShare" USING HASH ("token");

-- AddForeignKey
ALTER TABLE "TokenShare" ADD CONSTRAINT "TokenShare_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
