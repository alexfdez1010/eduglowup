-- CreateTable
CREATE TABLE "ExtendedSummary" (
    "partId" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "summary" VARCHAR(3000) NOT NULL,

    CONSTRAINT "ExtendedSummary_pkey" PRIMARY KEY ("partId","order")
);

-- AddForeignKey
ALTER TABLE "ExtendedSummary" ADD CONSTRAINT "ExtendedSummary_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;
