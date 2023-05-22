import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ModerationPostsFilterInput,
  ModerationPostPaginationInput,
  ModerationPostCreateInput,
} from 'src/graphql';
import { PostModerationService } from './post-moderation.service';

@Resolver('ModerationPost')
export class PostModerationResolver {
  constructor(private postModerationService: PostModerationService) {}

  @Query()
  async moderationPosts(
    @Args('filter', { nullable: true }) filter?: ModerationPostsFilterInput,
    @Args('pagination', { nullable: true })
    pagination?: ModerationPostPaginationInput,
  ) {
    const { totalCount, edges, pageInfo } =
      await this.postModerationService.getModerationPosts(filter, pagination);

    return { totalCount, edges, pageInfo };
  }

  @Mutation()
  async createModerationPost(@Args('data') data: ModerationPostCreateInput) {
    return await this.postModerationService.createPost(data);
  }
}
