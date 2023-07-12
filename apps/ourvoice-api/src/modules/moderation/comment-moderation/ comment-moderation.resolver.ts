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
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../auth/auth.guard';

@UseGuards(new AuthGuard())
@Resolver('ModerationComment')
export class CommentModerationResolver {
  constructor(private commentModerationService: CommentModerationService) {}

  @Query()
  async moderationComment(@Args('id') id: number): Promise<Comment> {
    return await this.commentModerationService.getModerationCommentById(id);
  }

  @Query()
  async moderationComments(
    @Args('filter', { nullable: true }) filter?: ModerationCommentsFilterInput,
    @Args('pagination', { nullable: true })
    pagination?: ModerationCommentPaginationInput,
  ): Promise<ModerationCommentsResponse> {
    const { totalCount, edges, pageInfo } =
      await this.commentModerationService.getModerationComments(
        filter,
        pagination,
      );

    return { totalCount, edges, pageInfo };
  }

  @Query()
  async commentVersion(@Args('id') id: number): Promise<CommentVersion> {
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
    @Args('id') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
  ): Promise<Comment> {
    return await this.commentModerationService.approveCommentVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  @Mutation()
  async rejectModerationCommentVersion(
    @Args('id') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
  ): Promise<Comment> {
    return await this.commentModerationService.rejectCommentVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  @Mutation()
  async modifyModerationComment(
    @Args('commentId') id: number,
    @Args('moderatorHash') moderatorHash: string,
    @Args('moderatorNickname') moderatorNickname: string,
    @Args('reason') reason: string,
    @Args('data') data: ModerationCommentModifyInput,
  ): Promise<Comment> {
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
    @Args('commentId') commentId: number,
  ): Promise<Comment> {
    return await this.commentModerationService.rollbackModifiedModerationComment(
      commentId,
    );
  }

  @Mutation()
  async renewCommentModeration(
    @Args('commentModerationId') id: number,
    @Args('moderatorHash') moderatorHash: string,
  ): Promise<Comment> {
    return await this.commentModerationService.renewCommentModeration(
      id,
      moderatorHash,
    );
  }
}
