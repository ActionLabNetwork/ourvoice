/*
  Warnings:

  - You are about to drop the column `timeToSend` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `secureLink` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `timeToSend` on the `Post` table. All the data in the column will be lost.
  - You are about to alter the column `content` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `active` on the `UserType` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserType` table. All the data in the column will be lost.
  - You are about to drop the column `disabledAt` on the `UserType` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserType` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedAt` on the `UserType` table. All the data in the column will be lost.
  - Made the column `published` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `moderated` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropIndex
DROP INDEX "Vote_userId_postId_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "timeToSend";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "secureLink",
DROP COLUMN "timeToSend",
ALTER COLUMN "published" SET NOT NULL,
ALTER COLUMN "content" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "authorId" SET NOT NULL,
ALTER COLUMN "moderated" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "active" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserType" DROP COLUMN "active",
DROP COLUMN "createdAt",
DROP COLUMN "disabledAt",
DROP COLUMN "updatedAt",
DROP COLUMN "verifiedAt";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
