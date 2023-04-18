import { PostCreateDto } from 'src/modules/post/dto/post-create.dto';
import { PostUpdateDto } from 'src/modules/post/dto/post-update.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from 'src/modules/post/post.service';

@Resolver('Post')
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query()
  async post(@Args('id') id: number) {
    return this.postService.getPostById(id);
  }

  @Query()
  async postsByCategories(@Args('categories') categories: string[]) {
    return this.postService.getPostsByCategories(categories);
  }

  @Mutation()
  async createPost(@Args('data') data: PostCreateDto) {
    return this.postService.createPost(data);
  }

  @Mutation()
  async updatePost(@Args('id') id: number, @Args('data') data: PostUpdateDto) {
    return this.postService.updatePost(id, data);
  }

  @Mutation()
  async deletePost(@Args('id') id: number) {
    return this.postService.deletePost(id);
  }
}
