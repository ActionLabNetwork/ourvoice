/*
  Warnings:

  - You are about to drop the column `authorId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorHash` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorNickname` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorHash` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorNickname` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorHash` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorNickname` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_typeId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "authorId",
ADD COLUMN     "authorHash" TEXT NOT NULL,
ADD COLUMN     "authorNickname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
ADD COLUMN     "authorHash" TEXT NOT NULL,
ADD COLUMN     "authorNickname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "userId",
ADD COLUMN     "authorHash" TEXT NOT NULL,
ADD COLUMN     "authorNickname" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserType";
