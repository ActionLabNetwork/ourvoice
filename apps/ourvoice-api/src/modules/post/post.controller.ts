import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';
import { PostService } from './post.service';

@Controller('api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() data: any): Promise<PostModel> {
    return this.postService.createPost(data);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.getPostById(Number(id));
  }

  @Get()
  async getPostsByCategories(
    @Query('categories') categories: string,
  ): Promise<PostModel[]> {
    const categoryNames = categories.split(',');
    return this.postService.getPostsByCategories(categoryNames);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() data: any,
  ): Promise<PostModel> {
    return this.postService.updatePost(Number(id), data);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost(Number(id));
  }
}
