import { PaginationInput } from './../../graphql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostRepository } from './post.repository';
import { PostCreateDto } from './dto/post-create.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PostsFilterDto } from './dto/posts-filter.dto';
import { PostUpdateDto } from './dto/post-update.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(data: PostCreateDto): Promise<Post> {
    const postCreateDto = plainToClass(PostCreateDto, data);
    const errors = await validate(postCreateDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { authorId, categoryIds: categories, ...restData } = data;

    const postData = {
      ...restData,
      author: { connect: { id: authorId } },
      categories: {
        connect: categories.map((id) => ({ id })),
      },
    };
    return this.postRepository.createPost(postData);
  }

  async getPostById(id: number): Promise<Post> {
    return this.postRepository.getPostById(id);
  }

  async getPosts(
    filter: PostsFilterDto,
    pagination: PaginationInput,
  ): Promise<Post[]> {
    if (filter) {
      const postsFilterDto = plainToClass(PostsFilterDto, filter);
      const errors = await validate(postsFilterDto);

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
    }

    return this.postRepository.getPosts(filter, pagination);
  }

  async getPostsByCategories(
    categoryNames: string[],
    skip: number,
    take: number,
  ): Promise<Post[]> {
    return this.postRepository.getPostsByCategories(categoryNames, skip, take);
  }

  async updatePost(id: number, data: PostUpdateDto): Promise<Post> {
    const postsUpdateDto = plainToClass(PostUpdateDto, data);
    const errors = await validate(postsUpdateDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.postRepository.updatePost(id, data);
  }

  async deletePost(id: number): Promise<Post> {
    return this.postRepository.deletePost(id);
  }
}
