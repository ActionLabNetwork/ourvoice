import { Category } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CategoriesFilterInput, PaginationInput } from 'src/graphql';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async getCategories(
    filter: CategoriesFilterInput,
    pagination: PaginationInput,
  ): Promise<Category[]> {
    const where: Prisma.CategoryWhereInput = {};

    if (filter) {
      if (filter.name) {
        where.name = { contains: filter.name, mode: 'insensitive' };
      }

      if (filter.active !== undefined) {
        where.active = filter.active;
      }

      if (filter.parentId) {
        where.parentId = filter.parentId;
      }

      if (filter.weight) {
        where.weight = filter.weight;
      }

      if (filter.createdBefore) {
        where.createdAt = { lt: new Date(filter.createdBefore) };
      }

      if (filter.createdAfter) {
        where.createdAt = { gt: new Date(filter.createdAfter) };
      }

      if (filter.disabledBefore) {
        where.disabledAt = { lt: new Date(filter.disabledBefore) };
      }

      if (filter.disabledAfter) {
        where.disabledAt = { gt: new Date(filter.disabledAfter) };
      }
    }

    const categories = await this.prisma.category.findMany({
      where,
      skip: pagination?.cursor ? 1 : 0,
      cursor: pagination?.cursor ? { id: pagination.cursor } : undefined,
      take: pagination?.limit,
    });

    return categories;
  }

  async getCategoriesByNames(
    name: string[],
    skip: number,
    take: number,
  ): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        name: {
          in: name,
          mode: 'insensitive',
        },
      },
      skip,
      take,
    });
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
