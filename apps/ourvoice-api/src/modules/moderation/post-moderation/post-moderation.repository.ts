import { PostModifyDto } from './dto/post-modify.dto';
import { Injectable } from '@nestjs/common';
import {
  Post,
  Prisma,
  PostVersion,
  PostModeration,
} from '@internal/prisma/client';
import { PrismaService } from 'src/database/premoderation/prisma.service';
import {
  ModerationPostsFilterInput,
  ModerationPostPaginationInput,
} from 'src/graphql';
import { cursorToNumber } from 'src/utils/cursor-pagination';
import { PostCreateDto } from './dto/post-create.dto';
import { PostService } from 'src/modules/post/post.service';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService,
  ) {}

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

  async rollbackModifiedModerationPost(postId: number) {
    return await this.prisma.$transaction(async (tx) => {
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

      // Fetch the updated post
      const updatedPost = await tx.post.findUnique({
        where: { id: postId },
        include: {
          versions: {
            orderBy: { version: 'desc' },
            include: { moderations: { orderBy: { timestamp: 'desc' } } },
          },
        },
      });

      return updatedPost;
    });
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

  async approvePost(postId: number) {
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

        console.log('Finished approving post with post id', postId);

        // TODO: Add as a new post entry in the main db
        const newPostInMainDb = await this.postService.createPost({
          title: post.versions[0].title,
          content: post.versions[0].content,
          categoryIds: post.versions[0].categoryIds,
          files: (post.versions[0].files as string[]) ?? undefined,
          authorHash: post.versions[0].authorHash,
          authorNickname: post.versions[0].authorNickname,
        });
        console.log('Created new post in main db with id', newPostInMainDb.id);

        await tx.post.update({
          where: { id: post.id },
          data: { postIdInMainDb: newPostInMainDb.id },
        });
        console.log(
          'Updated post with id',
          post.id,
          ' to have main db id',
          newPostInMainDb.id,
        );
      }
      console.log('DecisionsCount for ', postId, decisionsCount);
    });
  }

  async approveOrRejectPosts() {
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
        console.log(
          `Error approving post with post id ${post.id}. ${error.message}`,
        );
      }
    }

    // TODO: Reject posts (awaiting conditions/business logic)
  }
}
