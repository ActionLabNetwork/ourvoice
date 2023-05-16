import { Injectable } from '@nestjs/common';
import {
  Prisma as MainPrisma,
  Post,
  User,
  Category,
  Vote,
} from '@prisma/client';
import { Prisma as PremoderationPrisma } from '@internal/prisma/client';
import { PremoderationRepository } from './premoderation.repository';

@Injectable()
export class PremoderationService {
  constructor(
    private readonly premoderationRepository: PremoderationRepository,
  ) {}

  async copyPostToPremoderation(
    post: Post & {
      author?: User;
      categories?: Category[];
      comments?: Comment[];
      votes?: Vote[];
      _count?: MainPrisma.PostCountOutputType;
    },
  ): Promise<void> {
    const premoderationPost: PremoderationPrisma.PostCreateInput = {
      title: post.title,
      content: post.content,
      files: post.files,
      identifier: `post-${post.id}-premoderation`,
      authorHash: post.author.hash,
    };

    await this.premoderationRepository.copyPostToPremoderation(
      premoderationPost,
    );
  }
}
