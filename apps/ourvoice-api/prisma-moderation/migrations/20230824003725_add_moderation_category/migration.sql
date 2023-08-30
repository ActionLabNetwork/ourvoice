-- AlterTable
ALTER TABLE "CommentModeration" ADD COLUMN     "moderationCategory" TEXT;

-- AlterTable
ALTER TABLE "CommentVersion" ADD COLUMN     "moderationCategory" TEXT;

-- AlterTable
ALTER TABLE "PostModeration" ADD COLUMN     "moderationCategory" TEXT;

-- AlterTable
ALTER TABLE "PostVersion" ADD COLUMN     "moderationCategory" TEXT;
