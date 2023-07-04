import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/main/prisma.service';

import { Prisma } from '@prisma-main-db/client';
import { PollCreateDto } from './dto/poll-create.dto';
import { PollUpdateDto } from './dto/poll-update.dto';

@Injectable()
export class PollRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPoll(data: PollCreateDto) {
    return this.prisma.poll.create({
      data: {
        ...data,
        options: {
          create: data.options,
        },
      },
      include: {
        options: true,
      },
    });
  }

  async updatePoll(pollId: number, data: PollUpdateDto) {
    const { options, ...rest } = data;
    return await this.prisma.$transaction(async (tx) => {
      await tx.poll.update({
        where: { id: pollId },
        data: {
          ...rest,
        },
      });
      if (options !== undefined) {
        await tx.pollOption.deleteMany({
          where: { pollId: pollId },
        });
        await tx.pollOption.createMany({
          data: options.map((option) => ({
            pollId: pollId,
            option: option.option,
          })),
        });
      }

      return tx.poll.findUnique({
        where: {
          id: pollId,
        },
        include: {
          options: true,
        },
      });
    });
  }

  async removePollById(pollId: number) {
    return await this.prisma.poll.delete({
      where: {
        id: pollId,
      },
    });
  }

  async getPoll(id: number) {
    return await this.prisma.poll.findUnique({
      where: {
        id,
      },
      include: {
        options: true,
      },
    });
  }

  async getPollOption(optionId: number) {
    return await this.prisma.pollOption.findUnique({
      where: {
        id: optionId,
      },
    });
  }

  async getPolls(filter: { expiresAfter?: Date; active?: boolean }) {
    const { expiresAfter, active } = filter;
    const where: Prisma.PollWhereInput = {};
    if (expiresAfter) {
      where.OR = [{ expiresAt: { gt: expiresAfter } }, { expiresAt: null }];
    }
    if (active !== undefined) {
      where.active = active;
    }

    return await this.prisma.poll.findMany({
      where,
      include: {
        options: true,
      },
    });
  }
}
