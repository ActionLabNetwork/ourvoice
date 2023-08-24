-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "publishedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "CommentModeration" ADD COLUMN     "hasContentWarning" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CommentVersion" ADD COLUMN     "hasContentWarning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasFromTheModeratorsTag" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "publishedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PostModeration" ADD COLUMN     "hasContentWarning" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PostVersion" ADD COLUMN     "hasContentWarning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasFromTheModeratorsTag" BOOLEAN NOT NULL DEFAULT false;
