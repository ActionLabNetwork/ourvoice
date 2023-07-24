import { PrismaService } from '../../database/main/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Comment } from '@prisma-main-db/client';
import { CommentsFilterInput, CommentPaginationInput } from 'src/graphql';
import { cursorToNumber } from '../../utils/cursor-pagination';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(data: Prisma.CommentCreateInput) {
    return this.prisma.comment.create({
      data,
      include: {
        post: true,
        parent: true,
      },
    });
  }

  async getCommentById(id: number) {
    return this.prisma.comment.findUnique({
      where: { id },
      // include: {
      //   author: true,
      //   post: true,
      //   parent: true,
      // },
    });
  }

  async getComments(
    filter?: CommentsFilterInput,
    pagination?: CommentPaginationInput,
  ): Promise<{ totalCount: number; comments: Comment[] }> {
    const {
      content,
      moderated,
      published,
      authorHash,
      authorNickname,
      postId,
      parentId,
      createdAfter,
      createdBefore,
      moderatedAfter,
      moderatedBefore,
      publishedAfter,
      publishedBefore,
      disabledAfter,
      disabledBefore,
    } = filter ?? {};

    const where: Prisma.CommentWhereInput = {
      content: content ? { contains: content, mode: 'insensitive' } : undefined,
      moderated: moderated ?? undefined,
      published: published ?? undefined,
      authorHash: authorHash ?? undefined,
      authorNickname: authorNickname ?? undefined,
      postId: postId ?? undefined,
      parentId: parentId ?? undefined,
      createdAt: createdAfter || createdBefore ? {} : undefined,
      moderatedAt: moderatedAfter || moderatedBefore ? {} : undefined,
      publishedAt: publishedAfter || publishedBefore ? {} : undefined,
      disabledAt: disabledAfter || disabledBefore ? {} : undefined,
      children: undefined, //Todo: add children filter,
    };
    if (createdAfter) {
      where.createdAt['gte'] = createdAfter;
    }
    if (createdBefore) {
      where.createdAt['lte'] = createdBefore;
    }
    if (moderatedAfter) {
      where.moderatedAt['gte'] = moderatedAfter;
    }
    if (moderatedBefore) {
      where.moderatedAt['lte'] = moderatedBefore;
    }
    if (publishedAfter) {
      where.publishedAt['gte'] = publishedAfter;
    }
    if (publishedBefore) {
      where.publishedAt['lte'] = publishedBefore;
    }
    if (disabledAfter) {
      where.disabledAt['gte'] = disabledAfter;
    }
    if (disabledBefore) {
      where.disabledAt['lte'] = disabledBefore;
    }
    const totalCount = await this.prisma.comment.count({ where });
    const comments = await this.prisma.comment.findMany({
      where,
      include: {
        post: true,
        parent: true,
        children: true,
      },
      skip: pagination?.cursor ? 1 : undefined,
      cursor: pagination?.cursor
        ? { id: cursorToNumber(pagination.cursor.toString()) }
        : undefined,
      take: pagination?.limit ?? 10,
      orderBy: { createdAt: 'desc' },
    });

    return { totalCount, comments };
  }

  async updateComment(id: number, data: Prisma.CommentUpdateInput) {
    const commentExists = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!commentExists) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return this.prisma.comment.update({
      where: { id },
      data,
      include: {
        post: true,
        parent: true,
        children: true,
      },
    });
  }

  async deleteComment(id: number) {
    const commentExists = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!commentExists) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return this.prisma.comment.delete({
      where: { id },
      include: {
        post: true,
        parent: true,
        children: true,
      },
    });
  }
}
