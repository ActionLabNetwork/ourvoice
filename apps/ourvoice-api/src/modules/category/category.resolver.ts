import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryService } from './category.service';

@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query()
  async category(@Args('id') id: number): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  @Query()
  async categoriesByNames(
    @Args('names', { type: () => [String] }) names: string[],
  ): Promise<Category[]> {
    return this.categoryService.getCategoriesByNames(names);
  }

  @Mutation()
  async createCategory(
    @Args('data') data: CategoryCreateDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(data);
  }

  @Mutation()
  async updateCategory(
    @Args('id') id: number,
    @Args('data') data: CategoryUpdateDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, data);
  }

  @Mutation()
  async deleteCategory(@Args('id') id: number): Promise<Category> {
    return this.categoryService.deleteCategory(id);
  }
}
