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
import { ModerationPostRepository } from './post-moderation.repository';

@Injectable()
export class ModerationPostService {
  constructor(
    private readonly moderationPostRepository: ModerationPostRepository,
  ) {}

  async getModerationPostById(id: number) {
    return this.moderationPostRepository.getModerationPostById(id);
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
}
