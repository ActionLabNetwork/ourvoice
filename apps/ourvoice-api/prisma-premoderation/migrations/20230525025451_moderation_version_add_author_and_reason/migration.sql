/*
  Warnings:

  - Added the required column `authorHash` to the `CommentVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorHash` to the `PostVersion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentVersion" ADD COLUMN     "authorHash" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT;

-- AlterTable
ALTER TABLE "PostVersion" ADD COLUMN     "authorHash" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT;
