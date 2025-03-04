-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('BUDDY', 'USER', 'QUIZ', 'SHORT', 'TRUE_FALSE', 'CONCEPT', 'MINDMAP', 'SUMMARY');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "password" VARCHAR(100),
    "helloMessage" VARCHAR(5000),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" UUID,
    "money" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "buddyId" INTEGER NOT NULL,
    "preferences" VARCHAR(100) NOT NULL DEFAULT '',

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyClass" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "ownerId" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "link" UUID NOT NULL,

    CONSTRAINT "StudyClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" UUID NOT NULL,
    "filename" VARCHAR(50) NOT NULL,
    "classId" UUID NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "order" INTEGER NOT NULL,
    "summary" VARCHAR(3000),
    "documentId" UUID NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EdgesPart" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "partIdFrom" UUID NOT NULL,
    "partIdTo" UUID NOT NULL,

    CONSTRAINT "EdgesPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" UUID NOT NULL,
    "text" VARCHAR(2200) NOT NULL,
    "documentId" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySession" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextExercise" JSON,
    "activeExercise" BOOLEAN NOT NULL DEFAULT false,
    "language" VARCHAR(10) NOT NULL,
    "exercises" TEXT[],

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" UUID NOT NULL,
    "type" "BlockType" NOT NULL,
    "order" INTEGER NOT NULL,
    "content" JSON NOT NULL,
    "sessionId" UUID NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" UUID NOT NULL,
    "text" VARCHAR(250) NOT NULL,
    "sectionId" UUID NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Choice" (
    "id" UUID NOT NULL,
    "text" VARCHAR(250) NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" UUID NOT NULL,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortQuestion" (
    "id" UUID NOT NULL,
    "question" VARCHAR(250) NOT NULL,
    "rubric" VARCHAR(500) NOT NULL,
    "sectionId" UUID NOT NULL,

    CONSTRAINT "ShortQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrueFalseQuestion" (
    "id" UUID NOT NULL,
    "question" VARCHAR(250) NOT NULL,
    "isTrue" BOOLEAN NOT NULL,
    "sectionId" UUID NOT NULL,

    CONSTRAINT "TrueFalseQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concept" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "definition" VARCHAR(500) NOT NULL,
    "partId" UUID NOT NULL,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatisticsPart" (
    "userId" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "numSummaryShown" INTEGER NOT NULL DEFAULT 0,
    "totalConceptQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctConceptQuestions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StatisticsPart_pkey" PRIMARY KEY ("userId","partId","date")
);

-- CreateTable
CREATE TABLE "StatisticsSection" (
    "userId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "totalQuizQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctQuizQuestions" INTEGER NOT NULL DEFAULT 0,
    "totalShortQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctShortQuestions" INTEGER NOT NULL DEFAULT 0,
    "totalTrueFalseQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctTrueFalseQuestions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StatisticsSection_pkey" PRIMARY KEY ("userId","sectionId","date")
);

-- CreateTable
CREATE TABLE "_classParticipant" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_sessionDocuments" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_userId_key" ON "Configuration"("userId");

-- CreateIndex
CREATE INDEX "Configuration_userId_idx" ON "Configuration" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "StudyClass_ownerId_idx" ON "StudyClass" USING HASH ("ownerId");

-- CreateIndex
CREATE INDEX "StudyClass_link_idx" ON "StudyClass" USING HASH ("link");

-- CreateIndex
CREATE INDEX "Document_classId_idx" ON "Document" USING HASH ("classId");

-- CreateIndex
CREATE INDEX "Part_documentId_idx" ON "Part" USING HASH ("documentId");

-- CreateIndex
CREATE INDEX "EdgesPart_documentId_idx" ON "EdgesPart" USING HASH ("documentId");

-- CreateIndex
CREATE INDEX "Section_documentId_idx" ON "Section" USING HASH ("documentId");

-- CreateIndex
CREATE INDEX "Section_partId_idx" ON "Section" USING HASH ("partId");

-- CreateIndex
CREATE INDEX "StudySession_userId_idx" ON "StudySession" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "Block_sessionId_idx" ON "Block" USING HASH ("sessionId");

-- CreateIndex
CREATE INDEX "QuizQuestion_sectionId_idx" ON "QuizQuestion" USING HASH ("sectionId");

-- CreateIndex
CREATE INDEX "Choice_questionId_idx" ON "Choice" USING HASH ("questionId");

-- CreateIndex
CREATE INDEX "ShortQuestion_sectionId_idx" ON "ShortQuestion" USING HASH ("sectionId");

-- CreateIndex
CREATE INDEX "TrueFalseQuestion_sectionId_idx" ON "TrueFalseQuestion" USING HASH ("sectionId");

-- CreateIndex
CREATE INDEX "Concept_partId_idx" ON "Concept" USING HASH ("partId");

-- CreateIndex
CREATE INDEX "StatisticsPart_userId_partId_date_idx" ON "StatisticsPart"("userId", "partId", "date");

-- CreateIndex
CREATE INDEX "StatisticsSection_userId_sectionId_date_idx" ON "StatisticsSection"("userId", "sectionId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "_classParticipant_AB_unique" ON "_classParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_classParticipant_B_index" ON "_classParticipant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_sessionDocuments_AB_unique" ON "_sessionDocuments"("A", "B");

-- CreateIndex
CREATE INDEX "_sessionDocuments_B_index" ON "_sessionDocuments"("B");

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyClass" ADD CONSTRAINT "StudyClass_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_classId_fkey" FOREIGN KEY ("classId") REFERENCES "StudyClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EdgesPart" ADD CONSTRAINT "EdgesPart_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortQuestion" ADD CONSTRAINT "ShortQuestion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrueFalseQuestion" ADD CONSTRAINT "TrueFalseQuestion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatisticsPart" ADD CONSTRAINT "StatisticsPart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatisticsPart" ADD CONSTRAINT "StatisticsPart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatisticsSection" ADD CONSTRAINT "StatisticsSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatisticsSection" ADD CONSTRAINT "StatisticsSection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_classParticipant" ADD CONSTRAINT "_classParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "StudyClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_classParticipant" ADD CONSTRAINT "_classParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_sessionDocuments" ADD CONSTRAINT "_sessionDocuments_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_sessionDocuments" ADD CONSTRAINT "_sessionDocuments_B_fkey" FOREIGN KEY ("B") REFERENCES "StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

