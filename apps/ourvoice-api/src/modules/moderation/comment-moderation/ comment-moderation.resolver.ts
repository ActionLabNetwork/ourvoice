import { AuthService } from '../../../auth/auth.service';
import { ModerationCommentsResponse } from '../../../types/moderation/comment-moderation';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ModerationCommentCreateInput,
  ModerationCommentModifyInput,
  ModerationCommentPaginationInput,
  ModerationCommentsFilterInput,
} from 'src/graphql';
import { CommentModerationService } from './comment-moderation.service';
import { Comment, CommentVersion } from '@prisma-moderation-db/client';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../../auth/auth.guard';
import { GqlSession } from 'src/auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { validateUserPermission } from 'src/utils/auth';
import { AnalyticsInterceptor } from 'src/analytics/analytics.interceptor';

@UseGuards(new AuthGuard())
@Resolver('ModerationComment')
@UseInterceptors(AnalyticsInterceptor)
export class CommentModerationResolver {
  constructor(
    private commentModerationService: CommentModerationService,
    private authService: AuthService,
  ) {}

  @Query()
  async moderationComment(
    @GqlSession() session: SessionContainer,
    @Args('id') id: number,
  ): Promise<Comment> {
    await validateUserPermission(session);
    return await this.commentModerationService.getModerationCommentById(id);
  }
  @Query()
  async moderationCommentsHistory(
    @GqlSession() session: SessionContainer,
    @Args('id') id: number,
  ) {
    await validateUserPermission(session);
    return await this.commentModerationService.getHistoryOfModerationCommentById(
      id,
    );
  }

  @Query()
  async moderationComments(
    @GqlSession() session: SessionContainer,
    @Args('filter', { nullable: true }) filter?: ModerationCommentsFilterInput,
    @Args('pagination', { nullable: true })
    pagination?: ModerationCommentPaginationInput,
  ): Promise<ModerationCommentsResponse> {
    await validateUserPermission(session);
    const { totalCount, edges, pageInfo } =
      await this.commentModerationService.getModerationComments(
        filter,
        pagination,
      );

    return { totalCount, edges, pageInfo };
  }

  @Query()
  async commentVersion(
    @GqlSession() session: SessionContainer,
    @Args('id') id: number,
  ): Promise<CommentVersion> {
    await validateUserPermission(session);
    return await this.commentModerationService.getCommentVersionById(id);
  }

  @Mutation()
  async createModerationComment(
    @Args('data') data: ModerationCommentCreateInput,
  ): Promise<Comment> {
    return await this.commentModerationService.createComment(data);
  }

  @Mutation()
  async approveModerationCommentVersion(
    @GqlSession() session: SessionContainer,
    @Args('id') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
  ): Promise<Comment> {
    await validateUserPermission(session);
    await this.authService.validateModeratorHash(session, moderatorHash);

    return await this.commentModerationService.approveCommentVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  @Mutation()
  async rejectModerationCommentVersion(
    @GqlSession() session: SessionContainer,
    @Args('id') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
  ): Promise<Comment> {
    await validateUserPermission(session);
    await this.authService.validateModeratorHash(session, moderatorHash);

    return await this.commentModerationService.rejectCommentVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  @Mutation()
  async modifyModerationComment(
    @GqlSession() session: SessionContainer,
    @Args('commentId') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
    @Args('data') data: ModerationCommentModifyInput,
  ): Promise<Comment> {
    await validateUserPermission(session);
    await this.authService.validateModeratorHash(session, moderatorHash);

    return await this.commentModerationService.modifyModerationComment(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
      data,
    );
  }

  @Mutation()
  async rollbackModifiedModerationComment(
    @GqlSession() session: SessionContainer,
    @Args('commentId') commentId: number,
  ): Promise<Comment> {
    await validateUserPermission(session);
    return await this.commentModerationService.rollbackModifiedModerationComment(
      commentId,
    );
  }

  @Mutation()
  async renewCommentModeration(
    @GqlSession() session: SessionContainer,
    @Args('commentModerationId') id: number,
    @Args('moderatorHash') moderatorHash: string,
  ): Promise<Comment> {
    await validateUserPermission(session);
    await this.authService.validateModeratorHash(session, moderatorHash);

    return await this.commentModerationService.renewCommentModeration(
      id,
      moderatorHash,
    );
  }
}
