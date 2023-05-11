import { plainToClass } from 'class-transformer';
import {
  CategoriesFilterInput,
  CategoryCreateInput,
  CategoryUpdateInput,
  CategoryPaginationInput,
} from './../../graphql';
import { CategoryRepository } from './category.repository';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoryCreateDto } from './dto/category-create.dto';
import { validate } from 'class-validator';
import { CategoriesFilterDto } from './dto/categories-filter.dto';
import { numberToCursor } from '../../utils/cursor-pagination';
import { CategoryUpdateDto } from './dto/category-update.dto';
@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(data: CategoryCreateInput): Promise<Category> {
    const categoryCreateDto = plainToClass(CategoryCreateDto, data);
    const errors = await validate(categoryCreateDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Handle duplicate category
    const existingCategory = await this.categoryRepository.getCategories({
      name: data.name,
    });

    if (existingCategory.totalCount > 0) {
      throw new BadRequestException(
        `Category with name ${data.name} already exists`,
      );
    }

    // Handle creating subcategory
    const { parentId } = data;
    if (parentId) {
      const parentCategory = await this.categoryRepository.getCategoryById(
        parentId,
      );

      if (!parentCategory) {
        throw new BadRequestException('Invalid parentId provided');
      }

      if (!parentCategory.active) {
        throw new BadRequestException('Parent category is inactive');
      }
    }

    return this.categoryRepository.createCategory(data);
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.categoryRepository.getCategoryById(id);
  }

  async getCategories(
    filter?: CategoriesFilterInput,
    pagination?: CategoryPaginationInput,
  ): Promise<{
    totalCount: number;
    edges: { node: Category; cursor: string }[];
    pageInfo: {
      startCursor: string;
      endCursor: string;
      hasNextPage: boolean;
    };
  }> {
    // Validate filters
    if (filter) {
      const categoriesFilterDto = plainToClass(CategoriesFilterDto, filter);
      const errors = await validate(categoriesFilterDto);

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
    }

    // Handle pagination
    const { totalCount, categories } =
      await this.categoryRepository.getCategories(filter, pagination);

    const edges = categories.map((category) => ({
      node: category,
      cursor: numberToCursor(category.id),
    }));

    const pageInfo = {
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNextPage: categories.length < totalCount,
    };

    return { totalCount, edges, pageInfo };
  }

  async updateCategory(
    id: number,
    data: CategoryUpdateInput,
  ): Promise<Category> {
    const categoriesUpdateDto = plainToClass(CategoryUpdateDto, data);
    const errors = await validate(categoriesUpdateDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingCategory = await this.categoryRepository.getCategoryById(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.categoryRepository.updateCategory(id, data);
  }

  async deleteCategory(id: number): Promise<Category> {
    const existingCategory = await this.categoryRepository.getCategoryById(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.categoryRepository.deleteCategory(id);
  }
}
