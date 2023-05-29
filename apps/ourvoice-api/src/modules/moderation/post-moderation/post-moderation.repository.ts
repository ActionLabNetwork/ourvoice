import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, Prisma } from '@internal/prisma/client';
import { PrismaService } from 'src/database/premoderation/prisma.service';
import {
  ModerationPostsFilterInput,
  ModerationPostPaginationInput,
} from 'src/graphql';
import { cursorToNumber } from 'src/utils/cursor-pagination';
import { PostCreateDto } from './dto/post-create.dto';

@Injectable()
export class PostModerationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getModerationPostById(id: number): Promise<Post> {
    return await this.prisma.post.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: { moderations: { orderBy: { timestamp: 'desc' } } },
        },
      },
    });
  }

  async getModerationPosts(
    filter?: ModerationPostsFilterInput,
    pagination?: ModerationPostPaginationInput,
  ): Promise<{ totalCount: number; moderationPosts: Post[] }> {
    const { status } = filter ?? {};

    const where: Prisma.PostWhereInput = {
      versions: {
        some: {
          status: status ?? undefined,
        },
      },
    };

    const totalCount = await this.prisma.post.count({ where });

    const moderationPosts = await this.prisma.post.findMany({
      where,
      include: { versions: { orderBy: { version: 'desc' } } },
      skip: pagination?.cursor ? 1 : undefined,
      cursor: pagination?.cursor
        ? { id: cursorToNumber(pagination.cursor) }
        : undefined,
      take: pagination?.limit ?? 10,
    });

    return { totalCount, moderationPosts };
  }

  async createModerationPost(data: PostCreateDto) {
    const { title, content, categoryIds, files, authorHash } = data;
    const newPost = await this.prisma.post.create({
      data: {
        authorHash,
      },
    });

    await this.prisma.postVersion.create({
      data: {
        title,
        content,
        categoryIds,
        files,
        authorHash: authorHash,
        status: 'PENDING',
        post: { connect: { id: newPost.id } },
        latest: true,
        version: 1,
      },
    });

    return newPost;
  }

  async getPostVersionById(id: number) {
    return await this.prisma.postVersion.findUnique({
      where: { id },
      include: { moderations: { orderBy: { timestamp: 'desc' } } },
    });
  }

  async approvePostVersion(id: number, moderatorHash: string, reason: string) {
    const newPostModeration = await this.prisma.postModeration.create({
      data: {
        moderatorHash,
        decision: 'ACCEPTED',
        reason,
        postVersionId: id,
      },
      select: { postVersion: true },
    });

    const postId = newPostModeration.postVersion.postId;

    return await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: { moderations: { orderBy: { timestamp: 'desc' } } },
        },
      },
    });
  }

  async rejectPostVersion(id: number, moderatorHash: string, reason: string) {
    const newPostModeration = await this.prisma.postModeration.create({
      data: {
        moderatorHash,
        decision: 'REJECTED',
        reason,
        postVersionId: id,
      },
      select: { postVersion: true },
    });

    const postId = newPostModeration.postVersion.postId;

    return await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: { moderations: { orderBy: { timestamp: 'desc' } } },
        },
      },
    });
  }

  async modifyModerationPost(
    postId: number,
    moderatorHash: string,
    reason: string,
    data: any,
  ) {
    // TODO: Turn this all into a transaction
    // Fetch the current post
    const moderationPost = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: { moderations: { orderBy: { timestamp: 'desc' } } },
        },
      },
    });

    // Create a new PostVersion
    const postVersion: Prisma.PostVersionCreateInput = {
      title: data.title ?? moderationPost.versions[0].title,
      content: data.content ?? moderationPost.versions[0].content,
      categoryIds: data.categoryIds ?? moderationPost.versions[0].categoryIds,
      files: data.files ?? moderationPost.versions[0].files,
      authorHash: moderatorHash,
      status: 'PENDING',
      post: { connect: { id: postId } },
      reason,
      version: moderationPost.versions[0].version + 1,
      latest: true,
    };

    // Update latest field of latest post version to false
    await this.prisma.postVersion.update({
      where: { id: moderationPost.versions[0].id },
      data: { latest: false },
    });

    await this.prisma.postVersion.create({
      data: postVersion,
    });

    const modifiedModerationPost = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: { moderations: { orderBy: { timestamp: 'desc' } } },
        },
      },
    });

    return modifiedModerationPost;
  }

  async renewPostModeration(id: number) {
    console.log({ id });
    const postModeration = await this.prisma.postModeration.findUnique({
      where: { id },
      select: { postVersion: true },
    });

    if (!postModeration) {
      throw new Error('PostModeration not found');
    }

    const postId = postModeration.postVersion.postId;

    await this.prisma.postModeration.delete({ where: { id } });
    return await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: { moderations: { orderBy: { timestamp: 'desc' } } },
        },
      },
    });
  }
}
