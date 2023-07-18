import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  ModerationPostPaginationInput,
  ModerationPostsFilterInput,
} from '../../../graphql';
import { Post, PostVersion } from '@internals/@prisma-moderation-db/client';
import { numberToCursor } from '../../../utils/cursor-pagination';
import { ModerationPostsFilterDto } from './dto/posts-filter.dto';
import { PostModerationRepository } from './post-moderation.repository';
import { PostCreateDto } from './dto/post-create.dto';
import { PostModifyDto } from './dto/post-modify.dto';

@Injectable()
export class PostModerationService {
  constructor(
    private readonly moderationPostRepository: PostModerationRepository,
  ) {}

  async getModerationPostById(id: number): Promise<Post> {
    const moderationPost =
      await this.moderationPostRepository.getModerationPostById(id);

    if (!moderationPost) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return moderationPost;
  }

  async getModerationPosts(
    filter?: ModerationPostsFilterInput,
    pagination?: ModerationPostPaginationInput,
  ): Promise<{
    totalCount: number;
    edges: { node: Post; cursor: string }[];
    pageInfo: {
      startCursor: string;
      endCursor: string;
      hasNextPage: boolean;
    };
  }> {
    // Validate filters
    if (filter) {
      const moderationPostsFilterDto = plainToClass(
        ModerationPostsFilterDto,
        filter,
      );
      const errors = await validate(moderationPostsFilterDto);

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

    const { totalCount, moderationPosts } =
      await this.moderationPostRepository.getModerationPosts(filter, {
        ...pagination,
        limit: limit + 1,
      });

    if (pagination?.before) {
      hasPreviousPage = moderationPosts.length > limit;
      if (hasPreviousPage) moderationPosts.pop();
    }

    // Forward pagination is the default if no cursor is provided
    if (!pagination?.before || pagination?.after) {
      hasNextPage = moderationPosts.length > limit;
      if (hasNextPage) moderationPosts.pop();
    }

    const edges = moderationPosts.map((post) => ({
      node: post,
      cursor: numberToCursor(post.id),
    }));

    const pageInfo = {
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNextPage,
      hasPreviousPage,
    };

    return { totalCount, edges, pageInfo };
  }

  async createPost(data: PostCreateDto): Promise<Post> {
    const postCreateDto = plainToClass(PostCreateDto, data);
    const errors = await validate(postCreateDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.moderationPostRepository.createModerationPost(data);
  }

  async getPostVersionById(id: number): Promise<PostVersion> {
    const postVersion = await this.moderationPostRepository.getPostVersionById(
      id,
    );

    if (!postVersion) {
      throw new NotFoundException(`Post version with id ${id} not found`);
    }

    return postVersion;
  }

  async approvePostVersion(
    id: number,
    moderatorHash: string,
    moderatorNickname,
    reason: string,
  ): Promise<Post> {
    // Validate id exists
    const postToBeApproved =
      await this.moderationPostRepository.getPostVersionById(id);

    if (!postToBeApproved) {
      throw new NotFoundException('Post version does not exist');
    }

    if (!postToBeApproved.latest) {
      throw new BadRequestException('Post version is not the latest one');
    }

    return await this.moderationPostRepository.approvePostVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  async rejectPostVersion(
    id: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
  ): Promise<Post> {
    // Validate id exists
    const postToBeRejected =
      await this.moderationPostRepository.getPostVersionById(id);

    if (!postToBeRejected) {
      throw new NotFoundException('Post version does not exist');
    }

    // Validate that version is latest
    if (!postToBeRejected.latest) {
      throw new BadRequestException('Post version is not the latest one');
    }

    return await this.moderationPostRepository.rejectPostVersion(
      id,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  }

  async modifyModerationPost(
    postId: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
    data: PostModifyDto,
  ): Promise<Post> {
    // Validate data
    const postModifyDto = plainToClass(PostModifyDto, data);
    const errors = await validate(postModifyDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Validate reason
    if (!reason) {
      throw new BadRequestException('Reason is required');
    }

    // Validate post id
    const postToBeModified =
      await this.moderationPostRepository.getPostVersionById(postId);

    if (!postToBeModified) {
      throw new NotFoundException('Post version does not exist');
    }
    return await this.moderationPostRepository.modifyModerationPost(
      postId,
      moderatorHash,
      moderatorNickname,
      reason,
      data,
    );
  }

  // Meant to be used in testing to quickly rollback to the previous db state
  async rollbackModifiedModerationPost(postId: number): Promise<Post> {
    return await this.moderationPostRepository.rollbackModifiedModerationPost(
      postId,
    );
  }

  async renewPostModeration(id: number, moderatorHash: string): Promise<Post> {
    const moderationToBeRenewed =
      await this.moderationPostRepository.getPostModerationById(id);

    if (!moderationToBeRenewed) {
      throw new NotFoundException('Moderation does not exist');
    }

    if (moderationToBeRenewed.moderatorHash !== moderatorHash) {
      throw new BadRequestException('Invalid moderator hash');
    }

    return await this.moderationPostRepository.renewPostModeration(
      id,
      moderatorHash,
    );
  }
}
