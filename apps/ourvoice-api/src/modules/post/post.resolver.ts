import {
  PaginationInput,
  PostCreateInput,
  PostsFilterInput,
  PostUpdateInput,
} from './../../graphql';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from 'src/modules/post/post.service';
import { s3 } from 'src/config/s3-config';
import { generatePresignedUrl } from 'src/services/s3-service';

@Resolver('Post')
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query()
  async post(@Args('id') id: number) {
    return this.postService.getPostById(id);
  }

  @Query()
  async posts(
    @Args('filter', { nullable: true }) filter?: PostsFilterInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return this.postService.getPosts(filter, pagination);
  }

  @Query()
  async postsByCategories(
    @Args('categories', { type: () => [String] }) categories: string[],
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    return this.postService.getPostsByCategories(categories, skip, take);
  }

  @Query()
  async getPresignedUrls(
    @Args('bucket') bucket: string,
    @Args('keys', { type: () => [String] }) keys: string[],
    @Args('expiresIn') expiresIn: number,
  ) {
    const urls = await Promise.all(
      keys.map(async (key) => {
        const url = await generatePresignedUrl(s3, bucket, key, expiresIn);
        return { url, key };
      }),
    );
    return urls;
  }

  @Mutation()
  async createPost(@Args('data') data: PostCreateInput) {
    return this.postService.createPost(data);
  }

  @Mutation()
  async updatePost(
    @Args('id') id: number,
    @Args('data') data: PostUpdateInput,
  ) {
    return this.postService.updatePost(id, data);
  }

  @Mutation()
  async deletePost(@Args('id') id: number) {
    return this.postService.deletePost(id);
  }
}
