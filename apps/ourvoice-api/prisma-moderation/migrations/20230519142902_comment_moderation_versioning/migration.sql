/*
  Warnings:

  - You are about to drop the column `content` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `CommentModeration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentId` on the `CommentModeration` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedTitle` on the `CommentModeration` table. All the data in the column will be lost.
  - You are about to drop the column `categoryIds` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `files` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `latest` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - Added the required column `commentVersionId` to the `CommentModeration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentModeration" DROP CONSTRAINT "CommentModeration_commentId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "CommentModeration" DROP CONSTRAINT "CommentModeration_pkey",
DROP COLUMN "commentId",
DROP COLUMN "modifiedTitle",
ADD COLUMN     "commentVersionId" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CommentModeration_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "categoryIds",
DROP COLUMN "content",
DROP COLUMN "files",
DROP COLUMN "latest",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "PostVersion" ADD COLUMN     "categoryIds" INTEGER[],
ADD COLUMN     "latest" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CommentVersion" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "status" "PostStatus" NOT NULL,
    "latest" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "CommentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentVersion_commentId_version_key" ON "CommentVersion"("commentId", "version");

-- CreateIndex
CREATE INDEX "CommentModeration_commentVersionId_idx" ON "CommentModeration"("commentVersionId");

-- AddForeignKey
ALTER TABLE "CommentVersion" ADD CONSTRAINT "CommentVersion_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModeration" ADD CONSTRAINT "CommentModeration_commentVersionId_fkey" FOREIGN KEY ("commentVersionId") REFERENCES "CommentVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
