import { PostCreateDto } from './dto/post-create.dto';
import { PostUpdateDto } from './dto/post-update.dto';
import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(data: PostCreateDto): Promise<Post> {
    const postData = {
      ...data,
      author: { connect: { id: data.authorId } },
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

  async updatePost(id: number, data: PostUpdateDto): Promise<Post> {
    return this.postRepository.updatePost(id, data);
  }

  async deletePost(id: number): Promise<Post> {
    return this.postRepository.deletePost(id);
  }
}
