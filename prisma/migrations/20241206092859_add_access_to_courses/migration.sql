-- CreateTable
CREATE TABLE "_usersWithAccess" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_usersWithAccess_AB_unique" ON "_usersWithAccess"("A", "B");

-- CreateIndex
CREATE INDEX "_usersWithAccess_B_index" ON "_usersWithAccess"("B");

-- AddForeignKey
ALTER TABLE "_usersWithAccess" ADD CONSTRAINT "_usersWithAccess_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_usersWithAccess" ADD CONSTRAINT "_usersWithAccess_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
