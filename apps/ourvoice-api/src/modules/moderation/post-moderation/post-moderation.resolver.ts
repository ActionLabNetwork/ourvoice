import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ModerationPostsFilterInput,
  ModerationPostPaginationInput,
  ModerationPostCreateInput,
  ModerationPostModifyInput,
} from 'src/graphql';
import { PostModerationService } from './post-moderation.service';

@Resolver('ModerationPost')
export class PostModerationResolver {
  constructor(private postModerationService: PostModerationService) {}

  @Query()
  async moderationPost(@Args('id') id: number) {
    return await this.postModerationService.getModerationPostById(id);
  }

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

  @Query()
  async postVersion(@Args('id') id: number) {
    return await this.postModerationService.getPostVersionById(id);
  }

  @Mutation()
  async createModerationPost(@Args('data') data: ModerationPostCreateInput) {
    return await this.postModerationService.createPost(data);
  }

  @Mutation()
  async approveModerationPostVersion(
    @Args('id') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
  ) {
    return await this.postModerationService.approvePostVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  @Mutation()
  async rejectModerationPostVersion(
    @Args('id') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
  ) {
    return await this.postModerationService.rejectPostVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  @Mutation()
  async modifyModerationPost(
    @Args('postId') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
    @Args('data') data: ModerationPostModifyInput,
  ) {
    return await this.postModerationService.modifyModerationPost(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
      data,
    );
  }

  @Mutation()
  async rollbackModifiedModerationPost(@Args('postId') postId: number) {
    return await this.postModerationService.rollbackModifiedModerationPost(
      postId,
    );
  }

  @Mutation()
  async renewPostModeration(
    @Args('postModerationId') id: number,
    @Args('moderatorHash') moderatorHash: string,
  ) {
    return await this.postModerationService.renewPostModeration(
      id,
      moderatorHash,
    );
  }
}
