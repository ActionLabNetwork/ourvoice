/*
  Warnings:

  - You are about to drop the column `status` on the `CommentVersion` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PostVersion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CommentVersion" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "PostVersion" DROP COLUMN "status";
