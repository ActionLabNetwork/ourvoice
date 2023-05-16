// PremoderationRepository

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/premoderation/prisma.service';
import { Prisma, Post } from '@internal/prisma/client';

@Injectable()
export class PremoderationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async copyPostToPremoderation(post: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({ data: post });
  }
}
