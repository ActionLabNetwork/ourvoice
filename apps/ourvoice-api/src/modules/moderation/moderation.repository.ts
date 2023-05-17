import {
  ModerationPostsFilterInput,
  ModerationPostPaginationInput,
} from './../../graphql';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/premoderation/prisma.service';
import { Prisma, Post } from '@internal/prisma/client';
import { cursorToNumber } from 'src/utils/cursor-pagination';

@Injectable()
export class ModerationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPosts(
    filter?: ModerationPostsFilterInput,
    pagination?: ModerationPostPaginationInput,
  ): Promise<{ totalCount: number; posts: Post[] }> {
    const { title, content, status, authorHash } = filter ?? {};

    const where: Prisma.PostWhereInput = {
      title: title ? { contains: title, mode: 'insensitive' } : undefined,
      content: content ? { contains: content, mode: 'insensitive' } : undefined,
      status: { equals: status } ?? undefined,
      authorHash: { equals: authorHash } ?? undefined,
    };

    const totalCount = await this.prisma.post.count({ where });

    const posts = await this.prisma.post.findMany({
      where,
      include: { moderators: true, comments: true },
      skip: pagination?.cursor ? 1 : undefined,
      cursor: pagination?.cursor
        ? { id: cursorToNumber(pagination.cursor) }
        : undefined,
      take: pagination?.limit ?? 10,
    });

    return { totalCount, posts };
  }

  async getPostById(id: number): Promise<Post> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async copyPostToPremoderation(post: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({ data: post });
  }
}
