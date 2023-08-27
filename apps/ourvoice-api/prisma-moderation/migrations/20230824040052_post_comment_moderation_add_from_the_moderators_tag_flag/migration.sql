-- AlterTable
ALTER TABLE "CommentVersion" ADD COLUMN     "hasFromTheModeratorsTag" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PostVersion" ADD COLUMN     "hasFromTheModeratorsTag" BOOLEAN NOT NULL DEFAULT false;
