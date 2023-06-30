import { GetManyRepositoryResponse } from './../../../types/general';
import { PostModifyDto } from './dto/post-modify.dto';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import {
  Prisma,
  PostVersion,
  PostModeration,
} from '../../../../node_modules/@internal/prisma/client';
import { PrismaService } from '../../../database/premoderation/prisma.service';
import {
  ModerationPostsFilterInput,
  ModerationPostPaginationInput,
} from '../../../graphql';
import { cursorToNumber } from '../../../utils/cursor-pagination';
import { PostCreateDto } from './dto/post-create.dto';
import { PostService } from '../../../modules/post/post.service';
import {
  PostIncludesVersionIncludesModerations,
  PostIncludesVersion,
  ModerationIncludesVersion,
} from '../../../types/moderation/post-moderation';

function countPostVersionModerationDecisions(
  version: PostVersion & {
    moderations: PostModeration[];
  },
) {
  const groups = version.moderations.reduce((acc, moderation) => {
    const group = moderation.decision;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(moderation);
    return acc;
  }, {});

  const groupsCount = {} as Record<'ACCEPTED' | 'REJECTED', number>;

  if (groups) {
    Object.keys(groups).forEach((key) => {
      groupsCount[key] = groups[key].length;
    });

    return groupsCount;
  }
}

@Injectable()
export class PostModerationRepository {
  private readonly logger = new Logger(PostModerationRepository.name);

  constructor(
    @Inject(forwardRef(() => PrismaService))
    private readonly prisma: PrismaService,
    private readonly postService: PostService,
  ) {}

  async getModerationPostById(
    id: number,
  ): Promise<PostIncludesVersionIncludesModerations> {
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
  ): Promise<
    GetManyRepositoryResponse<'moderationPosts', PostIncludesVersion>
  > {
    const { status } = filter ?? {};

    const where: Prisma.PostWhereInput = {
      status: status ?? undefined,
    };

    const totalCount = await this.prisma.post.count({ where });

    // Determine if going forwards or backwards
    let cursorDirection = 1;
    let cursor: Prisma.PostWhereUniqueInput | undefined = undefined;
    if (pagination?.before) {
      cursorDirection = -1;
      cursor = { id: cursorToNumber(pagination.before) };
    } else if (pagination?.after) {
      cursorDirection = 1;
      cursor = { id: cursorToNumber(pagination.after) };
    }

    const moderationPosts = await this.prisma.post.findMany({
      where,
      include: { versions: { orderBy: { version: 'desc' } } },
      skip: cursor ? 1 : undefined,
      cursor: cursor,
      take: (pagination?.limit ?? 10) * cursorDirection,
      orderBy: { id: 'asc' },
    });

    return { totalCount, moderationPosts };
  }

  async getPostModerationById(id: number): Promise<ModerationIncludesVersion> {
    return await this.prisma.postModeration.findUnique({
      where: { id },
      include: { postVersion: true },
    });
  }

  async createModerationPost(
    data: PostCreateDto,
  ): Promise<PostIncludesVersion> {
    const { title, content, categoryIds, files, authorHash, authorNickname } =
      data;
    const newPost = await this.prisma.post.create({
      data: {
        authorHash,
        authorNickname,
        versions: {
          create: {
            title,
            content,
            categoryIds,
            files,
            authorHash,
            authorNickname,
            latest: true,
            version: 1,
          },
        },
      },
      include: { versions: true },
    });

    return newPost;
  }

  async getPostVersionById(
    id: number,
  ): Promise<PostVersion & { moderations: PostModeration[] }> {
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
  ): Promise<PostIncludesVersionIncludesModerations> {
    const newPostModeration = await this.prisma.$transaction(async (tx) => {
      // Check if moderator has already moderated this post version
      const existingPostModeration = await tx.postModeration.findFirst({
        where: {
          moderatorHash,
          postVersionId: id,
        },
      });

      if (existingPostModeration) {
        throw new Error('Moderator has already moderated this post version');
      }

      // Ensure that another moderator hasn't created a new version (modified) for the post, or else we'll rollback
      const postVersion = await tx.postVersion.findUnique({
        where: { id },
        include: { post: true },
      });

      if (!postVersion.latest) {
        throw new Error('Post version is not the latest');
      }

      // Check that post has pending status
      if (postVersion.post.status !== 'PENDING') {
        throw new Error('Post status is not PENDING');
      }

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

      return newPostModeration;
    });

    // Return the new post
    const postId = newPostModeration.postVersion.postId;
    return await this.findPostWithVersionsAndModerations(postId);
  }

  async rejectPostVersion(
    id: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
  ): Promise<PostIncludesVersionIncludesModerations> {
    const newPostModeration = await this.prisma.$transaction(async (tx) => {
      // Check if moderator has already moderated this post version
      const existingPostModeration = await tx.postModeration.findFirst({
        where: {
          moderatorHash,
          postVersionId: id,
        },
      });

      if (existingPostModeration) {
        throw new Error('Moderator has already moderated this post version');
      }

      // Ensure that another moderator hasn't created a new version (modified) for the post, or else we'll rollback
      const postVersion = await tx.postVersion.findUnique({
        where: { id },
      });

      if (!postVersion.latest) {
        throw new Error('Post version is not the latest');
      }

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

      return newPostModeration;
    });

    // Return the new post
    const postId = newPostModeration.postVersion.postId;
    return await this.findPostWithVersionsAndModerations(postId);
  }

  async modifyModerationPost(
    postId: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
    data: PostModifyDto,
  ): Promise<PostIncludesVersionIncludesModerations> {
    await this.prisma.$transaction(async (tx) => {
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
      return await tx.postVersion.create({
        data: {
          title: data.title ?? latestVersion.title,
          content: data.content ?? latestVersion.content,
          categoryIds: data.categoryIds ?? latestVersion.categoryIds,
          files: data.files ? data.files : latestVersion.files ?? undefined,
          authorHash: moderatorHash,
          authorNickname: moderatorNickname,
          post: { connect: { id: postId } },
          reason,
          version: latestVersion.version + 1,
          latest: true,
        },
      });
    });

    return await this.findPostWithVersionsAndModerations(postId);
  }

  async rollbackModifiedModerationPost(
    postId: number,
  ): Promise<PostIncludesVersionIncludesModerations> {
    await this.prisma.$transaction(async (tx) => {
      // Fetch the modified post
      const post = await tx.post.findUnique({
        where: { id: postId },
        include: { versions: { orderBy: { version: 'desc' } } },
      });

      // Set 2nd latest version to latest version
      await tx.postVersion.update({
        where: { id: post.versions[1].id },
        data: { latest: true },
      });

      // Delete the latest version
      await tx.postVersion.delete({
        where: { id: post.versions[0].id },
      });
    });

    // Fetch the updated post
    return this.findPostWithVersionsAndModerations(postId);
  }

  async renewPostModeration(
    id: number,
    moderatorHash: string,
  ): Promise<PostIncludesVersionIncludesModerations> {
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
    return await this.findPostWithVersionsAndModerations(renewedPostId);
  }

  async approvePost(postId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Check if the post has enough number of moderations
      const post = await tx.post.findUnique({
        where: { id: postId },
        include: {
          versions: {
            include: { moderations: { orderBy: { timestamp: 'desc' } } },
            orderBy: { version: 'desc' },
            take: 1,
          },
        },
      });

      const latestVersion = post.versions[0];
      const decisionsCount = countPostVersionModerationDecisions(latestVersion);

      if (!decisionsCount) {
        throw new Error('Post has no moderations');
      }

      if (decisionsCount.REJECTED > 0) {
        throw new Error(`Post has ${decisionsCount.REJECTED} rejections`);
      }

      if (decisionsCount.ACCEPTED >= post.requiredModerations) {
        await tx.post.update({
          where: { id: postId },
          data: { status: 'APPROVED' },
        });

        this.logger.log('Finished approving post with post id', postId);

        // TODO: Add as a new post entry in the main db
        const newPostInMainDb = await this.postService.createPost({
          title: post.versions[0].title,
          content: post.versions[0].content,
          categoryIds: post.versions[0].categoryIds,
          files: (post.versions[0].files as string[]) ?? undefined,
          authorHash: post.versions[0].authorHash,
          authorNickname: post.versions[0].authorNickname,
        });
        this.logger.log(
          'Created new post in main db with id',
          newPostInMainDb.id,
        );

        await tx.post.update({
          where: { id: post.id },
          data: { postIdInMainDb: newPostInMainDb.id },
        });
        this.logger.log(
          'Updated post with id',
          post.id,
          ' to have main db id',
          newPostInMainDb.id,
        );
      }
    });
  }

  async approveOrRejectPosts(): Promise<void> {
    const pendingPosts = await this.prisma.post.findMany({
      where: { status: 'PENDING' },
      include: {
        versions: { orderBy: { version: 'desc' }, take: 1 },
      },
    });

    for (const post of pendingPosts) {
      try {
        await this.approvePost(post.id);
      } catch (error) {
        this.logger.error(
          `Error approving post with post id ${post.id}. ${error.message}`,
        );
      }
    }

    // TODO: Reject posts (awaiting conditions/business logic)
  }

  async findPostWithVersionsAndModerations(
    postId: number,
  ): Promise<PostIncludesVersionIncludesModerations> {
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
