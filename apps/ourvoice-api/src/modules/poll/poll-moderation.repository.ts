import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/moderation/prisma.service';
import { PollVote, PollVoterVoted } from '@prisma-moderation-db/client';
import { PollPaginationInput } from 'src/graphql';
import { cursorTo } from 'readline';
import { cursorToNumber } from '../../utils/cursor-pagination';

@Injectable()
export class PollModerationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPollsVoterVoted(
    voterHash: string,
    pollIds?: number[],
  ): Promise<{ pollId: number }[]> {
    return this.prisma.pollVoterVoted.findMany({
      select: { pollId: true },
      where: {
        voterHash: voterHash,
        pollId: pollIds ? { in: pollIds } : undefined,
      },
    });
  }

  async countPollsVoterVoted(voterHash: string) {
    return this.prisma.pollVoterVoted.count({
      where: {
        voterHash: voterHash,
      },
    });
  }

  async hasVoterVotedInPoll(
    voterHash: string,
    pollId: number,
  ): Promise<boolean> {
    const pollVoterVoted = this.prisma.pollVoterVoted.findFirst({
      where: {
        pollId: pollId,
        voterHash: voterHash,
      },
    });
    return pollVoterVoted !== null;
  }

  async vote(
    voterHash: string,
    pollId: number,
    optionId: number,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const pollVoterVoted = await this.prisma.pollVoterVoted.findFirst({
        where: {
          pollId,
          voterHash,
        },
      });
      if (pollVoterVoted) {
        // TODO consider throwing a better exception and rewrap in the service level?
        throw new BadRequestException('User has already voted in poll');
      }

      const existingVote = await this.prisma.pollVote.findUnique({
        where: {
          pollId_optionId: { pollId, optionId },
        },
      });
      if (existingVote) {
        await this.prisma.pollVote.update({
          where: { pollId_optionId: { pollId, optionId } },
          data: { numVotes: existingVote.numVotes + 1 },
        });
      } else {
        await this.prisma.pollVote.create({
          data: {
            pollId,
            optionId,
            numVotes: 1,
          },
        });
      }

      await this.prisma.pollVoterVoted.create({
        data: {
          pollId,
          voterHash,
        },
      });
    });
  }

  async getPollVotes(pollId: number): Promise<PollVote[]> {
    return await this.prisma.pollVote.findMany({
      where: {
        pollId,
      },
      orderBy: {
        optionId: 'asc',
      },
    });
  }

  async removeAllVotesOfPoll(pollId: number): Promise<void> {
    this.prisma.$transaction(async (tx) => {
      tx.pollVote.deleteMany({
        where: { pollId },
      });
      tx.pollVoterVoted.deleteMany({
        where: { pollId },
      });
    });
  }
}
