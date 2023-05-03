import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Comment } from '@prisma/client';
import { CommentsFilterInput, PaginationInput } from 'src/graphql';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(data: Prisma.CommentCreateInput) {
    return this.prisma.comment.create({
      data,
      include: {
        author: true,
        post: true,
        parent: true,
      },
    });
  }

  async getCommentById(id: number) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async getComments(
    filter: CommentsFilterInput,
    pagination: PaginationInput,
  ): Promise<Comment[]> {
    const {
      content,
      moderated,
      published,
      authorId,
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
      authorId: authorId ?? undefined,
      postId: postId ?? undefined,
      parentId: parentId ?? undefined,
      createdAt: createdAfter || createdBefore ? {} : undefined,
      moderatedAt: moderatedAfter || moderatedBefore ? {} : undefined,
      publishedAt: publishedAfter || publishedBefore ? {} : undefined,
      disabledAt: disabledAfter || disabledBefore ? {} : undefined,
      children: undefined,
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
    const comments = await this.prisma.comment.findMany({
      where,
      include: {
        author: true,
        post: true,
        parent: true,
        children: true,
      },
      skip: pagination?.cursor ? 1 : undefined,
      cursor: pagination?.cursor ? { id: pagination.cursor } : undefined,
      take: pagination?.limit ?? 10,
    });

    return comments;
  }

  async updateComment(id: number, data: Prisma.CommentUpdateInput) {
    return this.prisma.comment.update({ where: { id }, data });
  }

  async deleteComment(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
