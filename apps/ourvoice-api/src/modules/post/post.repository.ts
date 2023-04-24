import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PostsFilterInput, PaginationInput } from 'src/graphql';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({ data });
  }

  async getPostById(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async getPosts(
    filter: PostsFilterInput,
    pagination: PaginationInput,
  ): Promise<Post[]> {
    const {
      title,
      content,
      moderated,
      published,
      votesDown,
      votesUp,
      authorId,
      categoryIds,
      createdAfter,
      createdBefore,
      moderatedAfter,
      moderatedBefore,
      publishedAfter,
      publishedBefore,
    } = filter ?? {};

    const where: Prisma.PostWhereInput = {
      title: title ? { contains: title, mode: 'insensitive' } : undefined,
      content: content ? { contains: content, mode: 'insensitive' } : undefined,
      moderated: moderated ?? undefined,
      published: published ?? undefined,
      votesDown: votesDown ?? undefined,
      votesUp: votesUp ?? undefined,
      authorId: authorId ?? undefined,
      categories: categoryIds
        ? { some: { id: { in: categoryIds } } }
        : undefined,
      createdAt: createdAfter || createdBefore ? {} : undefined,
      moderatedAt: moderatedAfter || moderatedBefore ? {} : undefined,
      publishedAt: publishedAfter || publishedBefore ? {} : undefined,
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

    const posts = await this.prisma.post.findMany({
      where,
      include: {
        author: true,
        categories: true,
        comments: true,
        votes: true,
      },
      skip: pagination?.cursor ? 1 : undefined,
      cursor: pagination?.cursor ? { id: pagination.cursor } : undefined,
      take: pagination?.limit ?? 10,
    });

    return posts;
  }

  async getPostsByCategories(
    categoryNames: string[],
    skip: number,
    take: number,
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
      skip,
      take,
    });
  }

  async updatePost(id: number, data: Prisma.PostUpdateInput) {
    return this.prisma.post.update({ where: { id }, data });
  }

  async deletePost(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
