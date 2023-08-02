import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Category } from '@prisma-main-db/client';
import {
  CategoriesFilterInput,
  CategoryCreateInput,
  CategoryPaginationInput,
  CategoryUpdateInput,
} from './../../graphql';
import { CategoryService } from './category.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { AnalyticsInterceptor } from 'src/analytics/analytics.interceptor';

@UseGuards(new AuthGuard())
@Resolver('Category')
@UseInterceptors(AnalyticsInterceptor)
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
  async numPosts(@Parent() category: Category): Promise<number> {
    const { id } = category;
    return this.categoryService.countNumPostsOfCategory(id);
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
