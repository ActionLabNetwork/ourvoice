import {
  CategoriesFilterInput,
  CategoryCreateInput,
  CategoryUpdateInput,
  CategoryPaginationInput,
} from './../../graphql';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from '@prisma-main-db/client';
import { CategoryService } from './category.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';

@UseGuards(new AuthGuard())
@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query()
  async category(@Args('id') id: number): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  @Query()
  async categories(
    @Args('filter') filter?: CategoriesFilterInput,
    @Args('pagination') pagination?: CategoryPaginationInput,
  ) {
    const { totalCount, edges, pageInfo } =
      await this.categoryService.getCategories(filter, pagination);

    return { totalCount, edges, pageInfo };
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
