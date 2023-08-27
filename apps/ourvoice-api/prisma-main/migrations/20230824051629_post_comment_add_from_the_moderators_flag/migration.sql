-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "hasFromTheModeratorsTag" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "hasFromTheModeratorsTag" BOOLEAN NOT NULL DEFAULT false;
