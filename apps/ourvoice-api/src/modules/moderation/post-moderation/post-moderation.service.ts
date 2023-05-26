import { Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  ModerationPostPaginationInput,
  ModerationPostsFilterInput,
} from 'src/graphql';
import { Post } from '@internal/prisma/client';
import { numberToCursor } from 'src/utils/cursor-pagination';
import { ModerationPostsFilterDto } from './dto/posts-filter.dto';
import { PostModerationRepository } from './post-moderation.repository';
import { PostCreateDto } from './dto/post-create.dto';

@Injectable()
export class PostModerationService {
  constructor(
    private readonly moderationPostRepository: PostModerationRepository,
  ) {}

  async getModerationPostById(id: number): Promise<Post> {
    return await this.moderationPostRepository.getModerationPostById(id);
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

    // Handle pagination
    const { totalCount, moderationPosts } =
      await this.moderationPostRepository.getModerationPosts(
        filter,
        pagination,
      );

    const edges = moderationPosts.map((post) => ({
      node: post,
      cursor: numberToCursor(post.id),
    }));

    const pageInfo = {
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNextPage: moderationPosts.length < totalCount,
    };

    return { totalCount, edges, pageInfo };
  }

  async createPost(data: PostCreateDto) {
    const postCreateDto = plainToClass(PostCreateDto, data);
    const errors = await validate(postCreateDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.moderationPostRepository.createModerationPost(data);
  }

  async getPostVersionById(id: number) {
    return await this.moderationPostRepository.getPostVersionById(id);
  }

  async approvePostVersion(id: number, moderatorHash: string, reason: string) {
    // TODO: Validate post version id exists
    // TODO: Validate moderator hash to see if they have permission/role
    // TODO: Validate post version is the latest one for its post
    // TODO: Additional validations...
    return await this.moderationPostRepository.approvePostVersion(
      id,
      moderatorHash,
      reason,
    );
  }

  async rejectPostVersion(id: number, moderatorHash: string, reason: string) {
    // TODO: Validate post version id exists
    // TODO: Validate moderator hash to see if they have permission/role
    // TODO: Validate post version is the latest one for its post
    // TODO: Additional validations...
    return await this.moderationPostRepository.rejectPostVersion(
      id,
      moderatorHash,
      reason,
    );
  }

  async modifyModerationPost(
    postId: number,
    moderatorHash: string,
    reason: string,
    data: any,
  ) {
    // TODO: Validate data using class-validator
    // TODO: Validate post id
    // TODO: Validate moderator hash to see if they have permission/role
    console.log('DATAAAA', data);
    return await this.moderationPostRepository.modifyModerationPost(
      postId,
      moderatorHash,
      reason,
      data,
    );
  }
}
