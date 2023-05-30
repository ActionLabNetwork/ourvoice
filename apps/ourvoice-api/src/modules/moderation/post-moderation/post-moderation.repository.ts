import { PostModifyDto } from './dto/post-modify.dto';
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

  async getPostModerationById(id: number) {
    return await this.prisma.postModeration.findUnique({
      where: { id },
      include: { postVersion: true },
    });
  }

  async createModerationPost(data: PostCreateDto) {
    const { title, content, categoryIds, files, authorHash, authorNickname } =
      data;
    const newPost = await this.prisma.post.create({
      data: {
        authorHash,
        authorNickname,
      },
    });

    await this.prisma.postVersion.create({
      data: {
        title,
        content,
        categoryIds,
        files,
        authorHash,
        authorNickname,
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

  async approvePostVersion(
    id: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
  ) {
    const newPostModeration = await this.prisma.$transaction(async (tx) => {
      // Create a new post moderation entry
      const newPostModeration = await tx.postModeration.create({
        data: {
          moderatorHash,
          moderatorNickname,
          decision: 'ACCEPTED',
          reason,
          postVersionId: id,
        },
        select: { postVersion: { select: { postId: true } } },
      });

      // Ensure that another moderator hasn't created a new version (modified) for the post, or else we'll rollback
      const postVersion = await tx.postVersion.findUnique({
        where: { id },
      });

      if (!postVersion.latest) {
        throw new Error('Post version is not the latest');
      }

      return newPostModeration;
    });

    // Return the new post
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

  async rejectPostVersion(
    id: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
  ) {
    const newPostModeration = await this.prisma.$transaction(async (tx) => {
      // Create a new post moderation entry
      const newPostModeration = await tx.postModeration.create({
        data: {
          moderatorHash,
          moderatorNickname,
          decision: 'REJECTED',
          reason,
          postVersionId: id,
        },
        select: { postVersion: { select: { postId: true } } },
      });

      // Ensure that another moderator hasn't created a new version (modified) for the post, or else we'll rollback
      const postVersion = await tx.postVersion.findUnique({
        where: { id },
      });

      if (!postVersion.latest) {
        throw new Error('Post version is not the latest');
      }

      return newPostModeration;
    });

    // Return the new post
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
    moderatorNickname: string,
    reason: string,
    data: PostModifyDto,
  ) {
    const modifiedModerationPost = await this.prisma.$transaction(
      async (tx) => {
        // Fetch the current post with the latest version
        const {
          versions: [latestVersion],
        } = await tx.post.findUnique({
          where: { id: postId },
          include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
        });

        // Update latest field of latest post version to false
        await tx.postVersion.update({
          where: { id: latestVersion.id },
          data: { latest: false },
        });

        // Create a new PostVersion
        const newPostVersion = await tx.postVersion.create({
          data: {
            title: data.title ?? latestVersion.title,
            content: data.content ?? latestVersion.content,
            categoryIds: data.categoryIds ?? latestVersion.categoryIds,
            files: data.files ? data.files : latestVersion.files ?? undefined,
            authorHash: moderatorHash,
            authorNickname: moderatorNickname,
            status: 'PENDING',
            post: { connect: { id: postId } },
            reason,
            version: latestVersion.version + 1,
            latest: true,
          },
        });

        // Fetch the latest version to validate
        const latestPostVersion = await tx.postVersion.findFirst({
          where: { postId: postId },
          orderBy: { version: 'desc' },
        });

        // Ensure that the latest post version is ours
        if (latestPostVersion.id !== newPostVersion.id) {
          throw new Error('Post version is not the latest');
        }

        // Fetch the updated post
        return await tx.post.findUnique({
          where: { id: postId },
          include: {
            versions: {
              orderBy: { version: 'desc' },
              include: { moderations: { orderBy: { timestamp: 'desc' } } },
            },
          },
        });
      },
    );

    return modifiedModerationPost;
  }

  async renewPostModeration(id: number, moderatorHash: string) {
    const renewedPostId = await this.prisma.$transaction(async (tx) => {
      // Fetch the postModeration and related post
      const postModeration = await tx.postModeration.findUnique({
        where: { id },
        include: { postVersion: true },
      });

      if (!postModeration) {
        throw new Error('PostModeration not found');
      }

      if (postModeration.moderatorHash !== moderatorHash) {
        throw new Error('Moderator hash does not match');
      }

      const postId = postModeration.postVersion.postId;

      // Delete the postModeration
      await tx.postModeration.delete({ where: { id } });

      return postId;
    });

    // Fetch the post with its versions and moderations
    return await this.prisma.post.findUnique({
      where: { id: renewedPostId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: { moderations: { orderBy: { timestamp: 'desc' } } },
        },
      },
    });
  }
}
