/*
  Warnings:

  - You are about to drop the column `latest` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedContent` on the `CommentModeration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "latest",
DROP COLUMN "timestamp",
DROP COLUMN "version",
ADD COLUMN     "requiredModerations" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "CommentModeration" DROP COLUMN "modifiedContent";
