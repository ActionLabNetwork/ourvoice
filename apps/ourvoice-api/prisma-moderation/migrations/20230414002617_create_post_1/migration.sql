-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "orgId" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "title" TEXT,
    "nickname" TEXT,
    "typeId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "disabledAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "UserType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "file" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numModerated" INTEGER NOT NULL DEFAULT 0,
    "latest" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latest" BOOLEAN NOT NULL DEFAULT true,
    "postId" INTEGER,
    "parentId" INTEGER,
    "authorId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostModeration" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "moderatorId" INTEGER NOT NULL,

    CONSTRAINT "PostModeration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostModerators" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "moderatorId" INTEGER NOT NULL,

    CONSTRAINT "PostModerators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentModeration" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "moderatorId" INTEGER NOT NULL,

    CONSTRAINT "CommentModeration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentModerators" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "moderatorId" INTEGER NOT NULL,

    CONSTRAINT "CommentModerators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostModerators" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CommentModerators" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_hash_key" ON "User"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "PostModeration_postId_moderatorId_key" ON "PostModeration"("postId", "moderatorId");

-- CreateIndex
CREATE UNIQUE INDEX "PostModerators_postId_moderatorId_key" ON "PostModerators"("postId", "moderatorId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentModeration_commentId_moderatorId_key" ON "CommentModeration"("commentId", "moderatorId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentModerators_commentId_moderatorId_key" ON "CommentModerators"("commentId", "moderatorId");

-- CreateIndex
CREATE UNIQUE INDEX "_PostModerators_AB_unique" ON "_PostModerators"("A", "B");

-- CreateIndex
CREATE INDEX "_PostModerators_B_index" ON "_PostModerators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommentModerators_AB_unique" ON "_CommentModerators"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentModerators_B_index" ON "_CommentModerators"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "UserType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostModeration" ADD CONSTRAINT "PostModeration_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostModeration" ADD CONSTRAINT "PostModeration_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostModerators" ADD CONSTRAINT "PostModerators_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostModerators" ADD CONSTRAINT "PostModerators_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModeration" ADD CONSTRAINT "CommentModeration_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModeration" ADD CONSTRAINT "CommentModeration_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModerators" ADD CONSTRAINT "CommentModerators_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModerators" ADD CONSTRAINT "CommentModerators_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostModerators" ADD CONSTRAINT "_PostModerators_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostModerators" ADD CONSTRAINT "_PostModerators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentModerators" ADD CONSTRAINT "_CommentModerators_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentModerators" ADD CONSTRAINT "_CommentModerators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
