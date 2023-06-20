import { CommentModifyDto } from './dto/comment-modify.dto';
import { Injectable, Logger } from '@nestjs/common';
import {
  Comment,
  Prisma,
  CommentVersion,
  CommentModeration,
} from '@internal/prisma/client';
import { PrismaService } from '../../../database/premoderation/prisma.service';
import {
  ModerationCommentPaginationInput,
  ModerationCommentsFilterInput,
} from 'src/graphql';
import { cursorToNumber } from '../../../utils/cursor-pagination';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentService } from '../../../modules/comment/comment.service';

function countCommentVersionModerationDecisions(
  version: CommentVersion & {
    moderations: CommentModeration[];
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
export class CommentModerationRepository {
  private readonly logger = new Logger(CommentModerationRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly commentService: CommentService,
  ) {}

  async getModerationCommentById(id: number): Promise<Comment> {
    return await this.prisma.comment.findUnique({
      where: { id },
      include: {
        parent: {
          include: {
            versions: {
              orderBy: { version: 'desc' },
              take: 1,
            },
          },
        },
        post: {
          include: {
            versions: {
              include: { moderations: { orderBy: { timestamp: 'desc' } } },
              orderBy: { version: 'desc' },
              take: 1,
            },
          },
        },
        versions: {
          orderBy: { version: 'desc' },
          include: {
            moderations: { orderBy: { timestamp: 'desc' } },
          },
        },
      },
    });
  }

  async getModerationComments(
    filter?: ModerationCommentsFilterInput,
    pagination?: ModerationCommentPaginationInput,
  ): Promise<{ totalCount: number; moderationComments: Comment[] }> {
    const { status } = filter ?? {};

    const where: Prisma.CommentWhereInput = {
      status: status ?? undefined,
    };

    const totalCount = await this.prisma.comment.count({ where });

    // Determine if going forwards or backwards
    let cursorDirection = 1;
    let cursor: Prisma.CommentWhereUniqueInput | undefined = undefined;
    if (pagination?.before) {
      cursorDirection = -1;
      cursor = { id: cursorToNumber(pagination.before) };
    } else if (pagination?.after) {
      cursorDirection = 1;
      cursor = { id: cursorToNumber(pagination.after) };
    }

    const moderationComments = await this.prisma.comment.findMany({
      where,
      include: { versions: { orderBy: { version: 'desc' } } },
      skip: cursor ? 1 : undefined,
      cursor: cursor,
      take: (pagination?.limit ?? 10) * cursorDirection,
      orderBy: { id: 'asc' },
    });

    return { totalCount, moderationComments };
  }

  async getCommentModerationById(id: number) {
    return await this.prisma.commentModeration.findUnique({
      where: { id },
      include: { commentVersion: true },
    });
  }

  async createModerationComment(data: CommentCreateDto) {
    const { content, postId, parentId, authorHash, authorNickname } = data;
    const connectData = { post: undefined, parent: undefined };

    if (postId) {
      const post = await this.prisma.post.findFirst({
        where: { postIdInMainDb: postId },
      });
      if (!post) {
        throw new Error('Post for comment not found in the moderation DB');
      } else {
        connectData.post = { connect: { id: post.id } };
      }
    }

    if (parentId) {
      const parentComment = await this.prisma.comment.findFirst({
        where: { commentIdInMainDb: parentId },
      });
      if (!parentComment) {
        throw new Error(
          'Parent comment for comment not found in the moderation DB',
        );
      } else {
        connectData.parent = { connect: { id: parentComment.id } };
      }
    }

    return await this.prisma.comment.create({
      data: {
        authorHash,
        authorNickname,
        ...connectData,
        versions: {
          create: {
            content,
            authorHash,
            authorNickname,
            latest: true,
            version: 1,
          },
        },
      },
      include: { versions: { orderBy: { version: 'desc' } } },
    });
  }

  async getCommentVersionById(id: number) {
    return await this.prisma.commentVersion.findUnique({
      where: { id },
      include: { moderations: { orderBy: { timestamp: 'desc' } } },
    });
  }

  async approveCommentVersion(
    id: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
  ) {
    const newCommentModeration = await this.prisma.$transaction(async (tx) => {
      // Check if moderator has already moderated this comment version
      const existingCommentModeration = await tx.commentModeration.findFirst({
        where: {
          moderatorHash,
          commentVersionId: id,
        },
      });

      if (existingCommentModeration) {
        throw new Error('Moderator has already moderated this comment version');
      }

      // Ensure that another moderator hasn't created a new version (modified) for the comment
      const commentVersion = await tx.commentVersion.findUnique({
        where: { id },
        include: { comment: true },
      });

      if (!commentVersion.latest) {
        throw new Error('Comment version is not the latest');
      }

      // Check that comment has pending status
      if (commentVersion.comment.status !== 'PENDING') {
        throw new Error('Post status is not PENDING');
      }

      // Create a new comment moderation entry
      const newCommentModeration = await tx.commentModeration.create({
        data: {
          moderatorHash,
          moderatorNickname,
          decision: 'ACCEPTED',
          reason,
          commentVersionId: id,
        },
        select: { commentVersion: { select: { commentId: true } } },
      });

      return newCommentModeration;
    });

    // Return the new comment
    const commentId = newCommentModeration.commentVersion.commentId;
    return await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: { moderations: { orderBy: { timestamp: 'desc' } } },
        },
      },
    });
  }

  async rejectCommentVersion(
    id: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
  ) {
    const newCommentModeration = await this.prisma.$transaction(async (tx) => {
      // Check if moderator has already moderated this comment version
      const existingCommentModeration = await tx.commentModeration.findFirst({
        where: {
          moderatorHash,
          commentVersionId: id,
        },
      });

      if (existingCommentModeration) {
        throw new Error('Moderator has already moderated this comment version');
      }

      // Ensure that another moderator hasn't created a new version (modified) for the comment
      const commentVersion = await tx.commentVersion.findUnique({
        where: { id },
        include: { comment: true },
      });

      if (!commentVersion.latest) {
        throw new Error('Comment version is not the latest');
      }

      // Check that comment has pending status
      if (commentVersion.comment.status !== 'PENDING') {
        throw new Error('Post status is not PENDING');
      }

      // Create a new comment moderation entry
      const newCommentModeration = await tx.commentModeration.create({
        data: {
          moderatorHash,
          moderatorNickname,
          decision: 'REJECTED',
          reason,
          commentVersionId: id,
        },
        select: { commentVersion: { select: { commentId: true } } },
      });

      return newCommentModeration;
    });

    // Return the new comment
    const commentId = newCommentModeration.commentVersion.commentId;
    return await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: { moderations: { orderBy: { timestamp: 'desc' } } },
        },
      },
    });
  }

  async modifyModerationComment(
    commentId: number,
    moderatorHash: string,
    moderatorNickname: string,
    reason: string,
    data: CommentModifyDto,
  ) {
    const modifiedModerationComment = await this.prisma.$transaction(
      async (tx) => {
        // Fetch the current comment with the latest version
        const {
          versions: [latestVersion],
        } = await tx.comment.findUnique({
          where: { id: commentId },
          include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
        });

        // Update latest field of latest comment version to false
        await tx.commentVersion.update({
          where: { id: latestVersion.id },
          data: { latest: false },
        });

        // Create a new CommentVersion
        const newCommentVersion = await tx.commentVersion.create({
          data: {
            content: data.content ?? latestVersion.content,
            authorHash: moderatorHash,
            authorNickname: moderatorNickname,
            comment: { connect: { id: commentId } },
            reason,
            version: latestVersion.version + 1,
            latest: true,
          },
        });

        // Fetch the latest version to validate
        const latestCommentVersion = await tx.commentVersion.findFirst({
          where: { commentId: commentId },
          orderBy: { version: 'desc' },
        });

        // Ensure that the latest comment version is ours
        if (latestCommentVersion.id !== newCommentVersion.id) {
          throw new Error('Comment version is not the latest');
        }

        // Fetch the updated comment
        return await tx.comment.findUnique({
          where: { id: commentId },
          include: {
            versions: {
              orderBy: { version: 'desc' },
              include: { moderations: { orderBy: { timestamp: 'desc' } } },
            },
          },
        });
      },
    );

    return modifiedModerationComment;
  }

  async rollbackModifiedModerationComment(commentId: number) {
    return await this.prisma.$transaction(async (tx) => {
      // Fetch the modified comment
      const comment = await tx.comment.findUnique({
        where: { id: commentId },
        include: { versions: { orderBy: { version: 'desc' } } },
      });

      // Set 2nd latest version to latest version
      await tx.commentVersion.update({
        where: { id: comment.versions[1].id },
        data: { latest: true },
      });

      // Delete the latest version
      await tx.commentVersion.delete({
        where: { id: comment.versions[0].id },
      });

      // Fetch the updated comment
      const updatedComment = await tx.comment.findUnique({
        where: { id: commentId },
        include: {
          versions: {
            orderBy: { version: 'desc' },
            include: { moderations: { orderBy: { timestamp: 'desc' } } },
          },
        },
      });

      return updatedComment;
    });
  }

  async renewCommentModeration(id: number, moderatorHash: string) {
    const renewedCommentId = await this.prisma.$transaction(async (tx) => {
      // Fetch the commentModeration and related comment
      const commentModeration = await tx.commentModeration.findUnique({
        where: { id },
        include: { commentVersion: true },
      });

      if (!commentModeration) {
        throw new Error('CommentModeration not found');
      }

      if (commentModeration.moderatorHash !== moderatorHash) {
        throw new Error('Moderator hash does not match');
      }

      const commentId = commentModeration.commentVersion.commentId;

      // Delete the commentModeration
      await tx.commentModeration.delete({ where: { id } });

      return commentId;
    });

    // Fetch the comment with its versions and moderations
    return await this.prisma.comment.findUnique({
      where: { id: renewedCommentId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: { moderations: { orderBy: { timestamp: 'desc' } } },
        },
      },
    });
  }

  async approveComment(commentId: number) {
    await this.prisma.$transaction(async (tx) => {
      // Check if the comment has enough number of moderations
      const comment = await tx.comment.findUnique({
        where: { id: commentId },
        include: {
          versions: {
            include: { moderations: { orderBy: { timestamp: 'desc' } } },
            orderBy: { version: 'desc' },
            take: 1,
          },
        },
      });

      const latestVersion = comment.versions[0];
      const decisionsCount =
        countCommentVersionModerationDecisions(latestVersion);

      if (!decisionsCount) {
        throw new Error('Comment has no moderations');
      }

      if (decisionsCount.REJECTED > 0) {
        throw new Error(`Comment has ${decisionsCount.REJECTED} rejections`);
      }

      if (decisionsCount.ACCEPTED >= comment.requiredModerations) {
        await tx.comment.update({
          where: { id: commentId },
          data: { status: 'APPROVED' },
        });

        this.logger.log(
          'Finished approving comment with comment id',
          commentId,
        );

        // TODO: Add as a new post entry in the main db
        const newCommentInMainDb = await this.commentService.createComment({
          content: comment.versions[0].content,
          authorHash: comment.versions[0].authorHash,
          authorNickname: comment.versions[0].authorNickname,
        });

        this.logger.log(
          'Created new comment in main db with id',
          newCommentInMainDb.id,
        );

        await tx.post.update({
          where: { id: comment.id },
          data: { postIdInMainDb: newCommentInMainDb.id },
        });
        this.logger.log(
          'Updated post with id',
          comment.id,
          ' to have main db id',
          newCommentInMainDb.id,
        );
      }
    });
  }

  async approveOrRejectComments() {
    const pendingComments = await this.prisma.comment.findMany({
      where: { status: 'PENDING' },
      include: {
        versions: { orderBy: { version: 'desc' }, take: 1 },
      },
    });

    for (const comment of pendingComments) {
      try {
        await this.approveComment(comment.id);
      } catch (error) {
        this.logger.error(
          `Error approving comment with comment id ${comment.id}. ${error.message}`,
        );
      }
    }

    // TODO: Reject comments (awaiting conditions/business logic)
  }
}
