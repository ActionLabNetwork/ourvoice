-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "timeToSend" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "secureLink" TEXT,
ADD COLUMN     "timeToSend" TIMESTAMP(3);
