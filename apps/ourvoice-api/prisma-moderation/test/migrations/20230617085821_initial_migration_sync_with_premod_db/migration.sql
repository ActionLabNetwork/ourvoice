-- CreateEnum
CREATE TYPE "Decision" AS ENUM ('ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING',
    "requiredModerations" INTEGER NOT NULL DEFAULT 1,
    "authorHash" TEXT NOT NULL,
    "authorNickname" TEXT NOT NULL,
    "postIdInMainDb" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostVersion" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "categoryIds" INTEGER[],
    "files" JSONB,
    "version" INTEGER NOT NULL DEFAULT 0,
    "authorHash" TEXT NOT NULL,
    "authorNickname" TEXT NOT NULL,
    "reason" TEXT,
    "latest" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "PostVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING',
    "requiredModerations" INTEGER NOT NULL DEFAULT 1,
    "authorHash" TEXT NOT NULL,
    "authorNickname" TEXT NOT NULL,
    "postId" INTEGER,
    "parentId" INTEGER,
    "commentIdInMainDb" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentVersion" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "authorHash" TEXT NOT NULL,
    "authorNickname" TEXT NOT NULL,
    "reason" TEXT,
    "latest" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "CommentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostModeration" (
    "id" SERIAL NOT NULL,
    "postVersionId" INTEGER NOT NULL,
    "moderatorHash" TEXT NOT NULL,
    "moderatorNickname" TEXT NOT NULL,
    "decision" "Decision" NOT NULL,
    "reason" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostModeration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentModeration" (
    "id" SERIAL NOT NULL,
    "commentVersionId" INTEGER NOT NULL,
    "moderatorHash" TEXT NOT NULL,
    "moderatorNickname" TEXT NOT NULL,
    "decision" "Decision" NOT NULL,
    "reason" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentModeration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostVersion_postId_version_key" ON "PostVersion"("postId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "CommentVersion_commentId_version_key" ON "CommentVersion"("commentId", "version");

-- CreateIndex
CREATE INDEX "PostModeration_postVersionId_idx" ON "PostModeration"("postVersionId");

-- CreateIndex
CREATE INDEX "CommentModeration_commentVersionId_idx" ON "CommentModeration"("commentVersionId");

-- AddForeignKey
ALTER TABLE "PostVersion" ADD CONSTRAINT "PostVersion_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVersion" ADD CONSTRAINT "CommentVersion_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostModeration" ADD CONSTRAINT "PostModeration_postVersionId_fkey" FOREIGN KEY ("postVersionId") REFERENCES "PostVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModeration" ADD CONSTRAINT "CommentModeration_commentVersionId_fkey" FOREIGN KEY ("commentVersionId") REFERENCES "CommentVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
