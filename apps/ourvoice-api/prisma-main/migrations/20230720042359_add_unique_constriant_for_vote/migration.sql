/*
  Warnings:

  - A unique constraint covering the columns `[authorHash,postId,commentId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vote_authorHash_postId_commentId_key" ON "Vote"("authorHash", "postId", "commentId");
