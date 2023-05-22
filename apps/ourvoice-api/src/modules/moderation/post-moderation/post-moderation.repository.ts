import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma } from '@internal/prisma/client';
import { PrismaService } from 'src/database/premoderation/prisma.service';
import {
  ModerationPostsFilterInput,
  ModerationPostPaginationInput,
} from 'src/graphql';
import { cursorToNumber } from 'src/utils/cursor-pagination';
import { PostCreateDto } from './dto/post-create.dto';

@Injectable()
export class PostModerationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getModerationPosts(
    filter?: ModerationPostsFilterInput,
    pagination?: ModerationPostPaginationInput,
  ): Promise<{ totalCount: number; moderationPosts: Post[] }> {
    const { status } = filter ?? {};

    const where: Prisma.PostWhereInput = {
      versions: {
        some: {
          status: status ?? undefined,
        },
      },
    };

    const totalCount = await this.prisma.post.count({ where });

    const moderationPosts = await this.prisma.post.findMany({
      where,
      include: { versions: true },
      skip: pagination?.cursor ? 1 : undefined,
      cursor: pagination?.cursor
        ? { id: cursorToNumber(pagination.cursor) }
        : undefined,
      take: pagination?.limit ?? 10,
    });

    return { totalCount, moderationPosts };
  }

  async createModerationPost(data: PostCreateDto) {
    const { title, content, categoryIds, files, authorHash } = data;
    const newPost = await this.prisma.post.create({
      data: {
        authorHash,
      },
    });

    await this.prisma.postVersion.create({
      data: {
        title,
        content,
        categoryIds,
        files,
        status: 'PENDING',
        post: { connect: { id: newPost.id } },
        latest: true,
      },
    });

    return newPost;
  }
}
