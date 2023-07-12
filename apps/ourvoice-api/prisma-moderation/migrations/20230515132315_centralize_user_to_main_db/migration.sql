/*
  Warnings:

  - You are about to drop the column `authorId` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `CommentModeration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `moderatorId` on the `CommentModeration` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `PostModeration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `moderatorId` on the `PostModeration` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorHash` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderatorHash` to the `CommentModeration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorHash` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderatorHash` to the `PostModeration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "CommentModeration" DROP CONSTRAINT "CommentModeration_moderatorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PostModeration" DROP CONSTRAINT "PostModeration_moderatorId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_typeId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "authorId",
ADD COLUMN     "authorHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CommentModeration" DROP CONSTRAINT "CommentModeration_pkey",
DROP COLUMN "moderatorId",
ADD COLUMN     "moderatorHash" TEXT NOT NULL,
ADD CONSTRAINT "CommentModeration_pkey" PRIMARY KEY ("commentId", "moderatorHash");

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
ADD COLUMN     "authorHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PostModeration" DROP CONSTRAINT "PostModeration_pkey",
DROP COLUMN "moderatorId",
ADD COLUMN     "moderatorHash" TEXT NOT NULL,
ADD CONSTRAINT "PostModeration_pkey" PRIMARY KEY ("postId", "moderatorHash");

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserType";
