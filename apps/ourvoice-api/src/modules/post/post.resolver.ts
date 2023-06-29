import {
  PostPaginationInput,
  PostsFilterInput,
  PostSortingInput,
} from './../../graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from '../../modules/post/post.service';
import { s3 } from '../../config/s3-config';
import {
  generatePresignedDownloadUrl,
  generatePresignedUploadUrl,
} from '../../services/s3-service';

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
    @Args('pagination', { nullable: true }) pagination?: PostPaginationInput,
    @Args('sort', { nullable: true }) sort?: PostSortingInput,
  ) {
    const { totalCount, edges, pageInfo } = await this.postService.getPosts(
      filter,
      pagination,
      sort,
    );

    return { totalCount, edges, pageInfo };
  }

  @Query()
  async postsByCategories(
    @Args('categories', { type: () => [String] }) categories: string[],
    @Args('filter', { nullable: true }) filter?: PostsFilterInput,
    @Args('pagination', { nullable: true }) pagination?: PostPaginationInput,
  ) {
    return this.postService.getPostsByCategories(
      categories,
      filter,
      pagination,
    );
  }

  @Query()
  async getPresignedUrls(
    @Args('bucket') bucket: string,
    @Args('keys', { type: () => [String] }) keys: string[],
    @Args('expiresIn') expiresIn: number,
  ) {
    const urls = await Promise.all(
      keys.map(async (key) => {
        const url = await generatePresignedUploadUrl(
          s3,
          bucket,
          key,
          expiresIn,
        );
        return { url, key };
      }),
    );
    return urls;
  }

  @Query()
  async getPresignedDownloadUrls(
    @Args('bucket') bucket: string,
    @Args('keys', { type: () => [String] }) keys: string[],
    @Args('expiresIn') expiresIn: number,
  ) {
    const urls = await Promise.all(
      keys.map(async (key) => {
        const url = await generatePresignedDownloadUrl(
          s3,
          bucket,
          key,
          expiresIn,
        );
        return { url, key };
      }),
    );
    return urls;
  }

  // @Mutation()
  // async updatePost(
  //   @Args('id') id: number,
  //   @Args('data') data: PostUpdateInput,
  // ) {
  //   return this.postService.updatePost(id, data);
  // }

  @Mutation()
  async deletePost(@Args('id') id: number) {
    return this.postService.deletePost(id);
  }
}
