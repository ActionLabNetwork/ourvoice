import { ModerationCommentsResponse } from '../../../types/moderation/comment-moderation';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Comment, CommentVersion } from '@prisma-moderation-db/client';
import { numberToCursor } from '../../../utils/cursor-pagination';
import { ModerationCommentsFilterDto } from './dto/comments-filter.dto';
import { CommentModerationRepository } from './comment-moderation.repository';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentModifyDto } from './dto/comment-modify.dto';
import {
  ModerationCommentPaginationInput,
  ModerationCommentsFilterInput,
} from 'src/graphql';

@Injectable()
export class CommentModerationService {
  constructor(
    private readonly moderationCommentRepository: CommentModerationRepository,
  ) {}

  async getModerationCommentById(id: number): Promise<Comment> {
    const moderationComment =
      await this.moderationCommentRepository.getModerationCommentById(id);

    if (!moderationComment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    return moderationComment;
  }

  async getModerationComments(
    filter?: ModerationCommentsFilterInput,
    pagination?: ModerationCommentPaginationInput,
  ): Promise<ModerationCommentsResponse> {
    // Validate filters
    if (filter) {
      const moderationCommentsFilterDto = plainToClass(
        ModerationCommentsFilterDto,
        filter,
      );
      const errors = await validate(moderationCommentsFilterDto);

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
    }

    // Validate pagination
    if (pagination?.before && pagination?.after) {
      throw new BadRequestException(
        "You cannot provide both 'before' and 'after' cursors. Please provide only one.",
      );
    }

    // Handle pagination
    const limit = pagination?.limit ?? 10;

    // We leave as undefined if we don't have a cursor to avoid doing a double fetch (backwards and forwards)
    let hasNextPage = undefined;
    let hasPreviousPage = undefined;

    const { totalCount, moderationComments } =
      await this.moderationCommentRepository.getModerationComments(filter, {
        ...pagination,
        limit: limit + 1,
      });

    if (pagination?.before) {
      hasPreviousPage = moderationComments.length > limit;
      if (hasPreviousPage) moderationComments.pop();
    }

    // Forward pagination is the default if no cursor is provided
    if (!pagination?.before || pagination?.after) {
      hasNextPage = moderationComments.length > limit;
      if (hasNextPage) moderationComments.pop();
    }

    const edges = moderationComments.map((comment) => ({
      node: comment,
      cursor: numberToCursor(comment.id),
    }));

    const pageInfo = {
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNextPage,
      hasPreviousPage,
    };

    return { totalCount, edges, pageInfo };
  }

  async createComment(data: CommentCreateDto): Promise<Comment> {
    const commentCreateDto = plainToClass(CommentCreateDto, data);
    const errors = await validate(commentCreateDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.moderationCommentRepository.createModerationComment(data);
  }

  async getCommentVersionById(id: number): Promise<CommentVersion> {
    const commentVersion =
      await this.moderationCommentRepository.getCommentVersionById(id);

    if (!commentVersion) {
      throw new NotFoundException(`Comment version with id ${id} not found`);
    }

    return commentVersion;
  }

  async approveCommentVersion(
    id: number,
    moderatorHash: string,
    moderatorNickname,
    reason: string,
  ): Promise<Comment> {
    // TODO: Validate moderator hash to see if they have permission/role

    // Validate id exists
    const commentToBeApproved =
      await this.moderationCommentRepository.getCommentVersionById(id);

    if (!commentToBeApproved) {
      throw new NotFoundException('Comment version does not exist');
    }

    if (!commentToBeApproved.latest) {
      throw new BadRequestException('Comment version is not the latest one');
    }

    return await this.moderationCommentRepository.approveCommentVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  async rejectCommentVersion(
    id: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
  ): Promise<Comment> {
    // TODO: Validate moderator hash to see if they have permission/role

    // Validate id exists
    const commentToBeRejected =
      await this.moderationCommentRepository.getCommentVersionById(id);

    if (!commentToBeRejected) {
      throw new NotFoundException('Comment version does not exist');
    }

    // Validate that version is latest
    if (!commentToBeRejected.latest) {
      throw new BadRequestException('Comment version is not the latest one');
    }

    return await this.moderationCommentRepository.rejectCommentVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  async modifyModerationComment(
    commentId: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
    data: CommentModifyDto,
  ): Promise<Comment> {
    // TODO: Validate moderator hash to see if they have permission/role

    // Validate data
    const commentModifyDto = plainToClass(CommentModifyDto, data);
    const errors = await validate(commentModifyDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Validate reason
    if (!reason) {
      throw new BadRequestException('Reason is required');
    }

    // Validate comment id
    const commentToBeModified =
      await this.moderationCommentRepository.getCommentVersionById(commentId);

    if (!commentToBeModified) {
      throw new NotFoundException('Comment version does not exist');
    }
    // TODO: Validate moderator hash to see if they have permission/role
    return await this.moderationCommentRepository.modifyModerationComment(
      commentId,
      moderatorHash,
      moderatorNickname,
      reason,
      data,
    );
  }

  // Meant to be used in testing to quickly rollback to the previous db state
  async rollbackModifiedModerationComment(commentId: number): Promise<Comment> {
    return await this.moderationCommentRepository.rollbackModifiedModerationComment(
      commentId,
    );
  }

  async renewCommentModeration(
    id: number,
    moderatorHash: string,
  ): Promise<Comment> {
    const moderationToBeRenewed =
      await this.moderationCommentRepository.getCommentModerationById(id);

    if (!moderationToBeRenewed) {
      throw new NotFoundException('Moderation does not exist');
    }

    if (moderationToBeRenewed.moderatorHash !== moderatorHash) {
      throw new BadRequestException('Invalid moderator hash');
    }

    if (moderationToBeRenewed.commentVersion.comment.status !== 'PENDING') {
      throw new BadRequestException('Comment is not pending');
    }

    return await this.moderationCommentRepository.renewCommentModeration(
      id,
      moderatorHash,
    );
  }
}
