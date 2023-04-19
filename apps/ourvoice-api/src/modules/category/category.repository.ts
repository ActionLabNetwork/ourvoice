import { Category } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async getCategoriesByNames(name: string[]): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        name: {
          in: name,
          mode: 'insensitive',
        },
      },
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
