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
} from 'src/graphql';
import { Post } from '@internal/prisma/client';
import { numberToCursor } from 'src/utils/cursor-pagination';
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
      hasNextPage: moderationPosts.length === (pagination?.limit ?? 10),
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
    const postVersion = await this.moderationPostRepository.getPostVersionById(
      id,
    );

    if (!postVersion) {
      throw new NotFoundException(`Post version with id ${id} not found`);
    }

    return postVersion;
  }

  async approvePostVersion(id: number, moderatorHash: string, reason: string) {
    // TODO: Validate moderator hash to see if they have permission/role

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
      reason,
    );
  }

  async rejectPostVersion(id: number, moderatorHash: string, reason: string) {
    // TODO: Validate moderator hash to see if they have permission/role

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
      reason,
    );
  }

  async modifyModerationPost(
    postId: number,
    moderatorHash: string,
    reason: string,
    data: PostModifyDto,
  ) {
    // TODO: Validate moderator hash to see if they have permission/role

    // Validate data
    const postModifyDto = plainToClass(PostModifyDto, data);
    const errors = await validate(postModifyDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Validate post id
    const postToBeModified =
      await this.moderationPostRepository.getPostVersionById(postId);

    if (!postToBeModified) {
      throw new NotFoundException('Post version does not exist');
    }
    // TODO: Validate moderator hash to see if they have permission/role
    return await this.moderationPostRepository.modifyModerationPost(
      postId,
      moderatorHash,
      reason,
      data,
    );
  }

  async renewPostModeration(id: number) {
    // TODO: Validate that the moderator hash matches the one in the moderation
    return await this.moderationPostRepository.renewPostModeration(id);
  }
}
