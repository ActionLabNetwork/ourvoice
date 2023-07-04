/*
  Warnings:

  - The primary key for the `PollVoterVoted` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PollVoterVoted" DROP CONSTRAINT "PollVoterVoted_pkey",
ADD CONSTRAINT "PollVoterVoted_pkey" PRIMARY KEY ("id");
