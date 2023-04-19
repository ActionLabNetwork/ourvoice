import { CategoryCreateInput, CategoryUpdateInput } from './../../graphql';
import { CategoryRepository } from './category.repository';
import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(data: CategoryCreateInput): Promise<Category> {
    return this.categoryRepository.createCategory(data);
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.categoryRepository.getCategoryById(id);
  }

  async getCategoriesByNames(
    name: string[],
    skip: number,
    take: number,
  ): Promise<Category[]> {
    return this.categoryRepository.getCategoriesByNames(name, skip, take);
  }

  async updateCategory(
    id: number,
    data: CategoryUpdateInput,
  ): Promise<Category> {
    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: number): Promise<Category> {
    return this.categoryRepository.delete(id);
  }
}
