import { AuthService } from './../../../auth/auth.service';
import { validateUserPermission } from './../../../utils/auth';
import { ModerationPostsResponse } from './../../../types/moderation/post-moderation';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ModerationPostsFilterInput,
  ModerationPostPaginationInput,
  ModerationPostCreateInput,
  ModerationPostModifyInput,
} from '../../../graphql';
import { PostModerationService } from './post-moderation.service';
import { Post, PostVersion } from '@prisma-moderation-db/client';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GqlSession } from 'src/auth/session.decorator';

@UseGuards(new AuthGuard())
@Resolver('ModerationPost')
export class PostModerationResolver {
  constructor(
    private postModerationService: PostModerationService,
    private authService: AuthService,
  ) {}

  private async verifyHashesAreEqual(
    session: SessionContainer,
    hash: string,
  ): Promise<boolean> {
    const userId = session.getUserId();
    const deployment = session['userDataInAccessToken'].deployment;
    const sessionHash = await this.authService.hashInput(userId, deployment);

    return sessionHash === hash;
  }

  private async validateModeratorHash(
    session: SessionContainer,
    moderatorHash: string,
  ): Promise<void> {
    const hashesAreEqual = await this.verifyHashesAreEqual(
      session,
      moderatorHash,
    );

    if (!hashesAreEqual) {
      throw new Error(
        'The moderator hash provided does not match the session hash',
      );
    }
  }

  @Query()
  async moderationPost(
    @GqlSession() session: SessionContainer,
    @Args('id') id: number,
  ): Promise<Post> {
    await validateUserPermission(session);
    return await this.postModerationService.getModerationPostById(id);
  }

  @Query()
  async moderationPosts(
    @GqlSession() session: SessionContainer,
    @Args('filter', { nullable: true }) filter?: ModerationPostsFilterInput,
    @Args('pagination', { nullable: true })
    pagination?: ModerationPostPaginationInput,
  ): Promise<ModerationPostsResponse> {
    await validateUserPermission(session);

    const { totalCount, edges, pageInfo } =
      await this.postModerationService.getModerationPosts(filter, pagination);

    return { totalCount, edges, pageInfo };
  }

  @Query()
  async postVersion(
    @GqlSession() session: SessionContainer,
    @Args('id') id: number,
  ): Promise<PostVersion> {
    await validateUserPermission(session);
    return await this.postModerationService.getPostVersionById(id);
  }

  @Mutation()
  async createModerationPost(
    @Args('data') data: ModerationPostCreateInput,
  ): Promise<Post> {
    return await this.postModerationService.createPost(data);
  }

  @Mutation()
  async approveModerationPostVersion(
    @GqlSession() session: SessionContainer,
    @Args('id') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
  ): Promise<Post> {
    await validateUserPermission(session);
    await this.validateModeratorHash(session, moderatorHash);

    return await this.postModerationService.approvePostVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  @Mutation()
  async rejectModerationPostVersion(
    @GqlSession() session: SessionContainer,
    @Args('id') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
  ): Promise<Post> {
    await validateUserPermission(session);
    await this.validateModeratorHash(session, moderatorHash);

    const hashesAreEqual = await this.verifyHashesAreEqual(
      session,
      moderatorHash,
    );

    if (!hashesAreEqual) {
      throw new Error(
        'The moderator hash provided does not match the session hash',
      );
    }

    return await this.postModerationService.rejectPostVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  @Mutation()
  async modifyModerationPost(
    @GqlSession() session: SessionContainer,
    @Args('postId') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
    @Args('data') data: ModerationPostModifyInput,
  ): Promise<Post> {
    await validateUserPermission(session);
    await this.validateModeratorHash(session, moderatorHash);

    return await this.postModerationService.modifyModerationPost(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
      data,
    );
  }

  @Mutation()
  async rollbackModifiedModerationPost(
    @GqlSession() session: SessionContainer,
    @Args('postId') postId: number,
  ): Promise<Post> {
    await validateUserPermission(session);
    return await this.postModerationService.rollbackModifiedModerationPost(
      postId,
    );
  }

  @Mutation()
  async renewPostModeration(
    @GqlSession() session: SessionContainer,
    @Args('postModerationId') id: number,
    @Args('moderatorHash') moderatorHash: string,
  ): Promise<Post> {
    await validateUserPermission(session);
    await this.validateModeratorHash(session, moderatorHash);

    return await this.postModerationService.renewPostModeration(
      id,
      moderatorHash,
    );
  }
}
