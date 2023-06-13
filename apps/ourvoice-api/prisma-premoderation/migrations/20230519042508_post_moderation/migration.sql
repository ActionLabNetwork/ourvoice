/*
  Warnings:

  - The primary key for the `PostModeration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `modifiedContent` on the `PostModeration` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedTitle` on the `PostModeration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,version]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "requiredModerations" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "PostModeration" DROP CONSTRAINT "PostModeration_pkey",
DROP COLUMN "modifiedContent",
DROP COLUMN "modifiedTitle",
ADD COLUMN     "moderationCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "PostModeration_pkey" PRIMARY KEY ("postId", "moderatorHash", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_version_key" ON "Post"("id", "version");

-- AddForeignKey
ALTER TABLE "PostModeration" ADD CONSTRAINT "PostModeration_postId_version_fkey" FOREIGN KEY ("postId", "version") REFERENCES "Post"("id", "version") ON DELETE RESTRICT ON UPDATE CASCADE;
