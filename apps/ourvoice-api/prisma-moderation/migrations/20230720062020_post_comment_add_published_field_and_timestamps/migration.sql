-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3);
