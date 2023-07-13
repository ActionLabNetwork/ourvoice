import { PrismaService } from '../../database/main/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import {
  PostsFilterInput,
  PostPaginationInput,
  PostSortingInput,
} from 'src/graphql';
import { cursorToNumber } from '../../utils/cursor-pagination';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPostById(id: number, include?: Prisma.PostInclude) {
    return this.prisma.post.findUnique({
      where: { id },
      include: include ?? {
        categories: true,
        comments: true,
        votes: true,
      },
    });
  }

  async getPosts(
    filter?: PostsFilterInput,
    pagination?: PostPaginationInput,
    sort?: PostSortingInput,
  ) {
    const {
      title,
      content,
      moderated,
      published,
      votesDown,
      votesUp,
      authorHash,
      authorNickname,
      categoryIds,
      createdAfter,
      createdBefore,
      moderatedAfter,
      moderatedBefore,
      publishedAfter,
      publishedBefore,
    } = filter ?? {};

    const {
      sortByCreatedAt,
      sortByModeratedAt,
      sortBypublishedAt,
      sortByVotesUp,
      sortByVotesDown,
      sortByCommentsCount,
    } = sort ?? {};

    const where: Prisma.PostWhereInput = {
      title: title ? { contains: title, mode: 'insensitive' } : undefined,
      content: content ? { contains: content, mode: 'insensitive' } : undefined,
      moderated: moderated ?? undefined,
      published: published ?? undefined,
      votesDown: votesDown ?? undefined,
      votesUp: votesUp ?? undefined,
      authorHash: authorHash ?? undefined,
      authorNickname: authorNickname ?? undefined,
      categories: categoryIds
        ? { some: { id: { in: categoryIds } } }
        : undefined,
      createdAt: createdAfter || createdBefore ? {} : undefined,
      moderatedAt: moderatedAfter || moderatedBefore ? {} : undefined,
      publishedAt: publishedAfter || publishedBefore ? {} : undefined,
    };

    const orderBy: Prisma.PostOrderByWithRelationInput[] = [];
    if (sortByCreatedAt) {
      orderBy.push({ createdAt: sortByCreatedAt });
    }
    if (sortByModeratedAt) {
      orderBy.push({ moderatedAt: sortByModeratedAt });
    }
    if (sortBypublishedAt) {
      orderBy.push({ publishedAt: sortBypublishedAt });
    }
    if (sortByVotesUp) {
      orderBy.push({ votesUp: sortByVotesUp });
    }
    if (sortByVotesDown) {
      orderBy.push({ votesDown: sortByVotesDown });
    }
    if (sortByCommentsCount) {
      orderBy.push({ comments: { _count: sortByCommentsCount } });
    }

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

    const totalCount = await this.prisma.post.count({ where });

    const posts = await this.prisma.post.findMany({
      where,
      include: {
        categories: true,
        comments: true,
        votes: true,
      },
      skip: pagination?.cursor ? 1 : undefined,
      cursor: pagination?.cursor
        ? { id: cursorToNumber(pagination.cursor) }
        : undefined,
      take: pagination?.limit ?? 10,
      orderBy,
    });

    return { totalCount, posts };
  }

  // TODO: remove lint ignores
  async getPostsByCategories(
    categoryNames: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter?: PostsFilterInput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pagination?: PostPaginationInput,
  ): Promise<Post[]> {
    return await this.prisma.post.findMany({
      where: {
        categories: {
          some: {
            name: {
              in: categoryNames,
              mode: 'insensitive',
            },
          },
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async createPost(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({ data });
  }

  // async updatePost(id: number, data: Prisma.PostUpdateInput) {
  //   const postExists = await this.prisma.post.findUnique({ where: { id } });

  //   if (!postExists) {
  //     throw new NotFoundException(`Post with ID ${id} not found`);
  //   }

  //   return this.prisma.post.update({
  //     where: { id },
  //     data,
  //     include: { categories: true },
  //   });
  // }

  async deletePost(id: number) {
    const postExists = await this.prisma.post.findUnique({ where: { id } });

    if (!postExists) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return this.prisma.post.delete({
      where: { id },
      include: { categories: true },
    });
  }
}
