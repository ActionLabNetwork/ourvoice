import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class VoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createVote(data: Prisma.VoteCreateInput) {
    const vote = await this.prisma.vote.create({
      data,
      include: { user: true, post: true, comment: true },
    });
    return vote;
  }

  async deleteVote(where: Prisma.VoteWhereUniqueInput) {
    const vote = await this.prisma.vote.delete({
      where,
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
