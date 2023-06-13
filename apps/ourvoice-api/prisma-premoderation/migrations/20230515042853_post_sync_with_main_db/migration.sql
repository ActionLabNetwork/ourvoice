/*
  Warnings:

  - You are about to drop the column `file` on the `Post` table. All the data in the column will be lost.
  - Made the column `title` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "file",
ADD COLUMN     "files" JSONB,
ALTER COLUMN "title" SET NOT NULL;
