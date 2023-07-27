-- CreateTable
CREATE TABLE "PollVoterVoted" (
    "id" SERIAL NOT NULL,
    "pollId" INTEGER NOT NULL,
    "voterHash" TEXT NOT NULL,

    CONSTRAINT "PollVoterVoted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollVote" (
    "pollId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "numVotes" INTEGER NOT NULL,

    CONSTRAINT "PollVote_pkey" PRIMARY KEY ("pollId","optionId")
);
