import { Injectable } from '@nestjs/common';
import { Prisma, Post } from '@prisma/client';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.postRepository.createPost(data);
  }

  async getPostById(id: number): Promise<Post> {
    return this.postRepository.getPostById(id);
  }

  async getPostsByCategories(categoryNames: string[]): Promise<Post[]> {
    return this.postRepository.getPostsByCategories(categoryNames);
  }

  async updatePost(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
    return this.postRepository.updatePost(id, data);
  }

  async deletePost(id: number): Promise<Post> {
    return this.postRepository.deletePost(id);
  }
}
