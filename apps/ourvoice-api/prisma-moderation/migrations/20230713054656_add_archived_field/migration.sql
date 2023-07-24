-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;
