import { PostCreateInput, PostUpdateInput } from './../../graphql';
import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(data: PostCreateInput): Promise<Post> {
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

  async getPostsByCategories(
    categoryNames: string[],
    skip: number,
    take: number,
  ): Promise<Post[]> {
    return this.postRepository.getPostsByCategories(categoryNames, skip, take);
  }

  async updatePost(id: number, data: PostUpdateInput): Promise<Post> {
    return this.postRepository.updatePost(id, data);
  }

  async deletePost(id: number): Promise<Post> {
    return this.postRepository.deletePost(id);
  }
}
