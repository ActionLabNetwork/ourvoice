/*
  Warnings:

  - The primary key for the `CommentModeration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CommentModeration` table. All the data in the column will be lost.
  - You are about to drop the column `numModerated` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `PostModeration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PostModeration` table. All the data in the column will be lost.
  - You are about to drop the `CommentModerators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostModerators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommentModerators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostModerators` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `decision` to the `CommentModeration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identifier` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `decision` to the `PostModeration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Decision" AS ENUM ('ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "CommentModerators" DROP CONSTRAINT "CommentModerators_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentModerators" DROP CONSTRAINT "CommentModerators_moderatorId_fkey";

-- DropForeignKey
ALTER TABLE "PostModerators" DROP CONSTRAINT "PostModerators_moderatorId_fkey";

-- DropForeignKey
ALTER TABLE "PostModerators" DROP CONSTRAINT "PostModerators_postId_fkey";

-- DropForeignKey
ALTER TABLE "_CommentModerators" DROP CONSTRAINT "_CommentModerators_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommentModerators" DROP CONSTRAINT "_CommentModerators_B_fkey";

-- DropForeignKey
ALTER TABLE "_PostModerators" DROP CONSTRAINT "_PostModerators_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostModerators" DROP CONSTRAINT "_PostModerators_B_fkey";

-- DropIndex
DROP INDEX "CommentModeration_commentId_moderatorId_key";

-- DropIndex
DROP INDEX "PostModeration_postId_moderatorId_key";

-- AlterTable
ALTER TABLE "CommentModeration" DROP CONSTRAINT "CommentModeration_pkey",
DROP COLUMN "id",
ADD COLUMN     "decision" "Decision" NOT NULL,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "CommentModeration_pkey" PRIMARY KEY ("commentId", "moderatorId");

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "numModerated",
ADD COLUMN     "identifier" TEXT NOT NULL,
ADD COLUMN     "sequence" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PostModeration" DROP CONSTRAINT "PostModeration_pkey",
DROP COLUMN "id",
ADD COLUMN     "decision" "Decision" NOT NULL,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "PostModeration_pkey" PRIMARY KEY ("postId", "moderatorId");

-- DropTable
DROP TABLE "CommentModerators";

-- DropTable
DROP TABLE "PostModerators";

-- DropTable
DROP TABLE "_CommentModerators";

-- DropTable
DROP TABLE "_PostModerators";
