-- CreateTable
CREATE TABLE "_contents" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_contents_AB_unique" ON "_contents"("A", "B");

-- CreateIndex
CREATE INDEX "_contents_B_index" ON "_contents"("B");

-- CreateIndex
CREATE INDEX "Course_slug_idx" ON "Course" USING HASH ("slug");

-- AddForeignKey
ALTER TABLE "_contents" ADD CONSTRAINT "_contents_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_contents" ADD CONSTRAINT "_contents_B_fkey" FOREIGN KEY ("B") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
