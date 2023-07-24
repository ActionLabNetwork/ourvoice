/*
  Warnings:

  - You are about to drop the column `sequence` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `PostModeration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `moderationCount` on the `PostModeration` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `PostModeration` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `PostModeration` table. All the data in the column will be lost.
  - Added the required column `postVersionId` to the `PostModeration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostModeration" DROP CONSTRAINT "PostModeration_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostModeration" DROP CONSTRAINT "PostModeration_postId_version_fkey";

-- DropIndex
DROP INDEX "Post_id_version_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "sequence",
DROP COLUMN "timestamp",
DROP COLUMN "version";

-- AlterTable
ALTER TABLE "PostModeration" DROP CONSTRAINT "PostModeration_pkey",
DROP COLUMN "moderationCount",
DROP COLUMN "postId",
DROP COLUMN "version",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "postVersionId" INTEGER NOT NULL,
ADD CONSTRAINT "PostModeration_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "PostVersion" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "files" JSONB,
    "version" INTEGER NOT NULL DEFAULT 0,
    "status" "PostStatus" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostVersion_postId_version_key" ON "PostVersion"("postId", "version");

-- CreateIndex
CREATE INDEX "PostModeration_postVersionId_idx" ON "PostModeration"("postVersionId");

-- AddForeignKey
ALTER TABLE "PostVersion" ADD CONSTRAINT "PostVersion_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostModeration" ADD CONSTRAINT "PostModeration_postVersionId_fkey" FOREIGN KEY ("postVersionId") REFERENCES "PostVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
