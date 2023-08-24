-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "hasContentWarning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasFromTheModeratorsTag" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "hasContentWarning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasFromTheModeratorsTag" BOOLEAN NOT NULL DEFAULT false;
