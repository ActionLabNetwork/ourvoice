import { PostPaginationInput } from './../../graphql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostRepository } from './post.repository';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PostsFilterDto } from './dto/posts-filter.dto';
import { numberToCursor } from '../../utils/cursor-pagination';
import { PostCreateDto } from './dto/post-create.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getPostById(id: number): Promise<Post> {
    return this.postRepository.getPostById(id);
  }

  async getPosts(
    filter?: PostsFilterDto,
    pagination?: PostPaginationInput,
  ): Promise<{
    totalCount: number;
    edges: { node: Post; cursor: string }[];
    pageInfo: {
      startCursor: string;
      endCursor: string;
      hasNextPage: boolean;
    };
  }> {
    // Validate filters
    if (filter) {
      const postsFilterDto = plainToClass(PostsFilterDto, filter);
      const errors = await validate(postsFilterDto);

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
    }

    // Handle pagination
    const { totalCount, posts } = await this.postRepository.getPosts(
      filter,
      pagination,
    );

    const edges = posts.map((post) => ({
      node: post,
      cursor: numberToCursor(post.id),
    }));

    const pageInfo = {
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNextPage: posts.length < totalCount,
    };

    return { totalCount, edges, pageInfo };
  }

  async getPostsByCategories(
    categoryNames: string[],
    filter?: PostsFilterDto,
    pagination?: PostPaginationInput,
  ): Promise<Post[]> {
    return this.postRepository.getPostsByCategories(
      categoryNames,
      filter,
      pagination,
    );
  }

  async createPost(data: PostCreateDto): Promise<Post> {
    const postCreateDto = plainToClass(PostCreateDto, data);
    const errors = await validate(postCreateDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { categoryIds: categories, ...restData } = data;

    const postData = {
      ...restData,
      categories: {
        connect: categories.map((id) => ({ id })),
      },
    };

    const newPost = await this.postRepository.createPost(postData);

    return newPost;
  }

  // async updatePost(id: number, data: PostUpdateDto): Promise<Post> {
  //   const postsUpdateDto = plainToClass(PostUpdateDto, data);
  //   const errors = await validate(postsUpdateDto);

  //   if (errors.length > 0) {
  //     throw new BadRequestException(errors);
  //   }

  //   const existingPost = await this.postRepository.getPostById(id);
  //   if (!existingPost) {
  //     throw new NotFoundException(`Post with id ${id} not found`);
  //   }

  //   return this.postRepository.updatePost(id, data);
  // }

  async deletePost(id: number): Promise<Post> {
    const existingPost = await this.postRepository.getPostById(id);
    if (!existingPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return this.postRepository.deletePost(id);
  }
}
