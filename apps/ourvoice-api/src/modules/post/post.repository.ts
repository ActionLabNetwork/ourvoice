import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({ data });
  }

  async getPostById(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
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
