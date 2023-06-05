import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class VoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createVote(data: Prisma.VoteCreateInput) {
    const { post, comment, voteType } = data; //comment is undefined means the vote is for post
    const vote = await this.prisma.vote.create({
      data,
      include: { user: true, post: true, comment: true },
    });
    if (comment) {
      await this.prisma.comment.update({
        where: { id: comment.connect.id },
        data: {
          [voteType == 'UPVOTE' ? 'votesUp' : 'votesDown']: {
            increment: 1,
          },
        },
      });
    } else if (post) {
      await this.prisma.post.update({
        where: { id: post.connect.id },
        data: {
          [voteType == 'UPVOTE' ? 'votesUp' : 'votesDown']: {
            increment: 1,
          },
        },
      });
    }
    return vote;
  }

  async deleteVote(where: Prisma.VoteWhereUniqueInput) {
    const voteToBeDeleted = await this.prisma.vote.findUnique({ where });
    if (voteToBeDeleted.commentId) {
      await this.prisma.comment.update({
        where: { id: voteToBeDeleted.commentId },
        data: {
          [voteToBeDeleted.voteType == 'UPVOTE' ? 'votesUp' : 'votesDown']: {
            decrement: 1,
          },
        },
      });
    } else if (voteToBeDeleted.postId) {
      await this.prisma.post.update({
        where: { id: voteToBeDeleted.postId },
        data: {
          [voteToBeDeleted.voteType == 'UPVOTE' ? 'votesUp' : 'votesDown']: {
            decrement: 1,
          },
        },
      });
    }

    const vote = await this.prisma.vote.delete({
      where: { id: voteToBeDeleted.id },
      include: { user: true, post: true, comment: true },
    });

    return vote;
  }

  async getVote(filter?: Prisma.VoteWhereInput) {
    return this.prisma.vote.findMany({
      where: filter,
      // where: {
      //   postId: undefined,
      // },
      include: {
        user: true,
        post: true,
        comment: true,
      },
    });
  }
}
