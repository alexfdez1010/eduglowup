-- CreateTable
CREATE TABLE "Experiment" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "metric" VARCHAR(50) NOT NULL,

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "experimentId" UUID NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssignment" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "experimentId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "result" INTEGER,

    CONSTRAINT "UserAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserAssignment_userId_idx" ON "UserAssignment" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "UserAssignment_experimentId_idx" ON "UserAssignment" USING HASH ("experimentId");

-- CreateIndex
CREATE INDEX "UserAssignment_variantId_idx" ON "UserAssignment" USING HASH ("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAssignment_userId_experimentId_key" ON "UserAssignment"("userId", "experimentId");

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
