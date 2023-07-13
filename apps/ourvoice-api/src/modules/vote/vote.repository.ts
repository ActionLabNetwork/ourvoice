import { PrismaService } from '../../database/main/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-main-db/client';

@Injectable()
export class VoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createVote(data: Prisma.VoteCreateInput) {
    return await this.prisma.$transaction(async (tx) => {
      const { post, comment, voteType } = data;
      if (comment) {
        // console.log('create vote for comment');
        await tx.comment.update({
          where: { id: comment.connect.id },
          data: {
            [voteType == 'UPVOTE' ? 'votesUp' : 'votesDown']: {
              increment: 1,
            },
          },
        });
      } else {
        // console.log('create vote for post');
        await tx.post.update({
          where: { id: post.connect.id },
          data: {
            [voteType == 'UPVOTE' ? 'votesUp' : 'votesDown']: {
              increment: 1,
            },
          },
        });
      }
      const vote = await tx.vote.create({
        data,
        include: { post: true, comment: true },
      });
      return vote;
    });
  }

  async deleteVote(where: Prisma.VoteWhereUniqueInput) {
    return await this.prisma.$transaction(async (tx) => {
      const voteToBeDeleted = await tx.vote.findUnique({ where });
      if (voteToBeDeleted.commentId) {
        await tx.comment.update({
          where: { id: voteToBeDeleted.commentId },
          data: {
            [voteToBeDeleted.voteType == 'UPVOTE' ? 'votesUp' : 'votesDown']: {
              decrement: 1,
            },
          },
        });
      } else {
        await tx.post.update({
          where: { id: voteToBeDeleted.postId },
          data: {
            [voteToBeDeleted.voteType == 'UPVOTE' ? 'votesUp' : 'votesDown']: {
              decrement: 1,
            },
          },
        });
      }
      const vote = await tx.vote.delete({
        where: { id: voteToBeDeleted.id },
        include: { post: true, comment: true },
      });
      return vote;
    });
  }

  async updateVoteById(id: number, data: Prisma.VoteUpdateInput) {
    const vote = await this.prisma.vote.update({
      where: { id },
      data: {
        voteType: data.voteType,
        [data.comment ? 'comment' : 'post']: {
          connect: data[data.comment ? 'comment' : 'post'].connect,
          update: {
            votesUp:
              data.voteType == 'UPVOTE' ? { increment: 1 } : { decrement: 1 },
            votesDown:
              data.voteType == 'DOWNVOTE' ? { increment: 1 } : { decrement: 1 },
          },
        },
      },
      include: { post: true, comment: true },
    });
    // console.log(vote);
    return vote;
  }

  async getVotes(filter?: Prisma.VoteWhereInput) {
    return this.prisma.vote.findMany({
      where: filter,
      include: {
        post: true,
        comment: true,
      },
    });
  }
}
