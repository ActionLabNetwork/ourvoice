import { Category, Prisma } from '@internals/@prisma-main-db/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/main/prisma.service';
import { CategoriesFilterInput, CategoryPaginationInput } from 'src/graphql';
import { cursorToNumber } from '../../utils/cursor-pagination';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async getCategories(
    filter?: CategoriesFilterInput,
    pagination?: CategoryPaginationInput,
  ): Promise<{ totalCount: number; categories: Category[] }> {
    const where: Prisma.CategoryWhereInput = {};

    if (filter) {
      applyIdsFilter(where, filter);
      applyNameFilter(where, filter);
      applyDescriptionFilter(where, filter);
      applyActiveFilter(where, filter);
      applyParentIdFilter(where, filter);
      applyWeightFilter(where, filter);
      applyDateFilters(where, filter);
    }

    const totalCount = await this.prisma.category.count({ where });

    const categories = await this.prisma.category.findMany({
      where,
      skip: pagination?.cursor ? 1 : undefined,
      cursor: pagination?.cursor
        ? { id: cursorToNumber(pagination.cursor) }
        : undefined,
      take: pagination?.limit ?? 10,
    });

    return { totalCount, categories };
  }

  async updateCategory(
    id: number,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    const categoryExists = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!categoryExists) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: number): Promise<Category> {
    const categoryExists = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!categoryExists) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}

// Helper functions for applying filters
function applyIdsFilter(where, filter) {
  if (filter.ids) {
    where.id = { in: filter.ids };
  }
}
function applyNameFilter(where, filter) {
  if (filter.name) {
    where.name = { contains: filter.name, mode: 'insensitive' };
  }
}

function applyDescriptionFilter(where, filter) {
  if (filter.description) {
    where.description = { contains: filter.description, mode: 'insensitive' };
  }
}

function applyActiveFilter(where, filter) {
  if (filter.active !== undefined) {
    where.active = filter.active;
  }
}

function applyParentIdFilter(where, filter) {
  if (filter.parentId) {
    where.parentId = filter.parentId;
  }
}

function applyWeightFilter(where, filter) {
  if (filter.weight) {
    where.weight = filter.weight;
  }
}

function applyDateFilters(where, filter) {
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
