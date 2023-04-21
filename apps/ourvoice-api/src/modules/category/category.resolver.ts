import {
  CategoriesFilterInput,
  CategoryCreateInput,
  CategoryUpdateInput,
  PaginationInput,
} from './../../graphql';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { CategoryService } from './category.service';

@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query()
  async category(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  @Query()
  async categories(
    @Args('filter', { type: () => CategoriesFilterInput, nullable: true })
    filter: CategoriesFilterInput,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination: PaginationInput,
  ): Promise<Category[]> {
    return this.categoryService.getCategories(filter, pagination);
  }

  @Query()
  async categoriesByNames(
    @Args('names', { type: () => [String] }) names: string[],
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Category[]> {
    return this.categoryService.getCategoriesByNames(names, skip, take);
  }

  @Mutation()
  async createCategory(
    @Args('data') data: CategoryCreateInput,
  ): Promise<Category> {
    return this.categoryService.createCategory(data);
  }

  @Mutation()
  async updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: CategoryUpdateInput,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, data);
  }

  @Mutation()
  async deleteCategory(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    return this.categoryService.deleteCategory(id);
  }
}
