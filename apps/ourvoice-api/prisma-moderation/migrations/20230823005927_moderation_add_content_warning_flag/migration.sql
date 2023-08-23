-- AlterTable
ALTER TABLE "CommentModeration" ADD COLUMN     "hasContentWarning" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CommentVersion" ADD COLUMN     "hasContentWarning" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PostModeration" ADD COLUMN     "hasContentWarning" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PostVersion" ADD COLUMN     "hasContentWarning" BOOLEAN NOT NULL DEFAULT false;
