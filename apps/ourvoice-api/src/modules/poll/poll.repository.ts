import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/main/prisma.service';

import { Prisma } from '@prisma-main-db/client';
import { PollFilterInput, PollPaginationInput } from 'src/graphql';
import { cursorToNumber } from '../../utils/cursor-pagination';
import { PollCreateDto } from './dto/poll-create.dto';
import { PollUpdateDto } from './dto/poll-update.dto';
import { create } from 'domain';

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

  async getPolls(filter?: PollFilterInput, pagination?: PollPaginationInput) {
    const {
      expiresBefore,
      expiresAfter,
      expiresExcludeNull,
      createdBefore,
      createdAfter,
      ...rest
    } = filter ?? {};

    const whereExpiresRange =
      expiresBefore || expiresAfter
        ? {
            expiresAt: { gte: expiresAfter, lte: expiresBefore },
          }
        : undefined;
    const whereExpires = whereExpiresRange
      ? expiresExcludeNull
        ? {
            AND: [whereExpiresRange, { expiresAt: { not: null } }],
          }
        : {
            OR: [whereExpiresRange, { expiresAt: null }],
          }
      : expiresExcludeNull
      ? { expiresAt: { not: null } }
      : undefined;

    const where: Prisma.PollWhereInput = {
      ...rest,
      AND: [
        createdBefore || createdAfter
          ? {
              createdAt: {
                gte: createdAfter,
                lte: createdBefore,
              },
            }
          : undefined,
        whereExpires,
      ],
    };

    const totalCount = await this.prisma.poll.count({ where });
    const polls = await this.prisma.poll.findMany({
      where,
      include: {
        options: true,
      },
      skip: pagination?.cursor ? 1 : undefined,
      cursor: pagination?.cursor
        ? { id: cursorToNumber(pagination.cursor) }
        : undefined,
      take: pagination?.limit ?? 10,
    });

    return { totalCount, polls };
  }
}
