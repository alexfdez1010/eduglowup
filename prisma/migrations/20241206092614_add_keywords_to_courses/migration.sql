-- CreateTable
CREATE TABLE "Keywords" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_keywords" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Keywords_name_key" ON "Keywords"("name");

-- CreateIndex
CREATE INDEX "Keywords_name_idx" ON "Keywords" USING HASH ("name");

-- CreateIndex
CREATE UNIQUE INDEX "_keywords_AB_unique" ON "_keywords"("A", "B");

-- CreateIndex
CREATE INDEX "_keywords_B_index" ON "_keywords"("B");

-- AddForeignKey
ALTER TABLE "_keywords" ADD CONSTRAINT "_keywords_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_keywords" ADD CONSTRAINT "_keywords_B_fkey" FOREIGN KEY ("B") REFERENCES "Keywords"("id") ON DELETE CASCADE ON UPDATE CASCADE;
