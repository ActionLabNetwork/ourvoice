import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ModerationPostsFilterInput,
  ModerationPostPaginationInput,
} from 'src/graphql';
import { ModerationPostService } from './post-moderation.service';

@Resolver('ModerationPost')
export class ModerationPostResolver {
  constructor(private moderationPostService: ModerationPostService) {}

  @Query()
  async moderationPost(@Args('id') id: number) {
    return this.moderationPostService.getModerationPostById(id);
  }

  @Query()
  async moderationPosts(
    @Args('filter', { nullable: true }) filter?: ModerationPostsFilterInput,
    @Args('pagination', { nullable: true })
    pagination?: ModerationPostPaginationInput,
  ) {
    console.log('test');
    const { totalCount, edges, pageInfo } =
      await this.moderationPostService.getModerationPosts(filter, pagination);

    return { totalCount, edges, pageInfo };
  }
}
