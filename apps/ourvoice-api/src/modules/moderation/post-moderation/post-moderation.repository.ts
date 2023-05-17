import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma } from '@internal/prisma/client';
import { PrismaService } from 'src/database/premoderation/prisma.service';
import {
  ModerationPostsFilterInput,
  ModerationPostPaginationInput,
} from 'src/graphql';
import { cursorToNumber } from 'src/utils/cursor-pagination';

@Injectable()
export class ModerationPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getModerationPostById(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`ModerationPost with ID ${id} not found`);
    }

    return post;
  }

  async getModerationPosts(
    filter?: ModerationPostsFilterInput,
    pagination?: ModerationPostPaginationInput,
  ): Promise<{ totalCount: number; moderationPosts: Post[] }> {
    const { title, content, status, authorHash } = filter ?? {};

    const where: Prisma.PostWhereInput = {
      title: title ? { contains: title, mode: 'insensitive' } : undefined,
      content: content ? { contains: content, mode: 'insensitive' } : undefined,
      status: status ?? undefined,
      authorHash: authorHash ?? undefined,
    };

    const totalCount = await this.prisma.post.count({ where });

    const moderationPosts = await this.prisma.post.findMany({
      where,
      skip: pagination?.cursor ? 1 : undefined,
      cursor: pagination?.cursor
        ? { id: cursorToNumber(pagination.cursor) }
        : undefined,
      take: pagination?.limit ?? 10,
    });

    return { totalCount, moderationPosts };
  }

  async createModerationPost(data: Prisma.PostCreateInput) {
    const newPost = await this.prisma.post.create({ data });
    // TODO: DELETE THIS
    console.log({ newPost });

    return newPost;
  }
}
