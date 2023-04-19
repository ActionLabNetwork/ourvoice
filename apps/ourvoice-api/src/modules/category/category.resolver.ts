import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
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
  async categoriesByNames(
    @Args('names', { type: () => [String] }) names: string[],
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Category[]> {
    return this.categoryService.getCategoriesByNames(names, skip, take);
  }

  @Mutation()
  async createCategory(
    @Args('data') data: CategoryCreateDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(data);
  }

  @Mutation()
  async updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: CategoryUpdateDto,
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
