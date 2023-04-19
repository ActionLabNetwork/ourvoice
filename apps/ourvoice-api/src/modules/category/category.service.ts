import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryRepository } from './category.repository';
import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(data: CategoryCreateDto): Promise<Category> {
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

  async updateCategory(id: number, data: CategoryUpdateDto): Promise<Category> {
    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: number): Promise<Category> {
    return this.categoryRepository.delete(id);
  }
}
