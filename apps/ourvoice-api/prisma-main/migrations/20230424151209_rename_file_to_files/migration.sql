/*
  Warnings:

  - You are about to drop the column `file` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "file",
ADD COLUMN     "files" JSONB;
