import { UseGuards } from '@nestjs/common';
import {
  Args,
  GqlExecutionContext,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Category } from '@prisma-main-db/client';
import { GqlContext, useDataloader } from 'src/utils/dataloader';
import { AuthGuard } from '../../auth/auth.guard';
import {
  CategoriesFilterInput,
  CategoryCreateInput,
  CategoryPaginationInput,
  CategoryUpdateInput,
} from './../../graphql';
import { CategoryService } from './category.service';

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

  @ResolveField()
  async numPosts(
    @GqlContext() context: GqlExecutionContext,
    @Parent() category: Category,
  ): Promise<number> {
    const { id } = category;
    return useDataloader(context, 'Category.numPosts', (keys: number[]) =>
      this.categoryService.countNumPostsOfCategories(keys),
    ).load(id);
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
