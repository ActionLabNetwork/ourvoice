/*
  Warnings:

  - The `file` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "file",
ADD COLUMN     "file" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
