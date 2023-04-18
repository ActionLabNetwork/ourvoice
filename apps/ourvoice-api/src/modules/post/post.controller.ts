import { PostUpdateDto } from './dto/post-update.dto';
import { PostCreateDto } from './dto/post-create.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';
import { PostService } from './post.service';

@Controller('api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPost(@Body() data: PostCreateDto): Promise<PostModel> {
    return this.postService.createPost(data);
  }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return this.postService.getPostById(id);
  }

  @Get()
  async getPostsByCategories(
    @Query('categories') categories: string[],
  ): Promise<PostModel[]> {
    return this.postService.getPostsByCategories(categories);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PostUpdateDto,
  ): Promise<PostModel> {
    return this.postService.updatePost(id, data);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return this.postService.deletePost(id);
  }
}
