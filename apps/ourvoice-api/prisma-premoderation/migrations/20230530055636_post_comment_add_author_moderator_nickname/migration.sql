/*
  Warnings:

  - Added the required column `authorNickname` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderatorNickname` to the `CommentModeration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorNickname` to the `CommentVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorNickname` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderatorNickname` to the `PostModeration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorNickname` to the `PostVersion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "authorNickname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CommentModeration" ADD COLUMN     "moderatorNickname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CommentVersion" ADD COLUMN     "authorNickname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "authorNickname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PostModeration" ADD COLUMN     "moderatorNickname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PostVersion" ADD COLUMN     "authorNickname" TEXT NOT NULL;
