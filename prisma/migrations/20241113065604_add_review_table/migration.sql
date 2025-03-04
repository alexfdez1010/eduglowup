-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "reviewText" VARCHAR(500) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
