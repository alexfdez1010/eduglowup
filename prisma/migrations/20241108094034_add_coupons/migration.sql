-- CreateTable
CREATE TABLE "Coupon" (
    "id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "money" INTEGER NOT NULL,
    "validUntil" TIMESTAMP(3),
    "limitOfUses" INTEGER NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponUsed" (
    "couponId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "CouponUsed_pkey" PRIMARY KEY ("couponId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "CouponUsed_couponId_userId_idx" ON "CouponUsed"("couponId", "userId");

INSERT INTO "Coupon" ("id", "code", "money", "validUntil", "limitOfUses")
VALUES ('11d002ed-cf21-4570-8ca3-d3b6a9518ce2', 'BETA_TESTERS_2032', 150, '2025-11-08', 20);
