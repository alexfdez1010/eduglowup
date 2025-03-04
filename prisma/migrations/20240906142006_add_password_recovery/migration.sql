-- CreateTable
CREATE TABLE "PasswordRetrieval"
(
    "userId"    UUID         NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token"     UUID         NOT NULL,

    CONSTRAINT "PasswordRetrieval_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "PasswordRetrieval"
    ADD CONSTRAINT "PasswordRetrieval_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
