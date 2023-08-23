import {
  CommentIncludesVersion,
  CommentIncludesVersionIncludesModerations,
  CommentIncludesVersionIncludesModerationsIncludesPost,
  CommentWithAllItsRelations,
  ModerationIncludesVersionIncludesComment,
} from './../../../types/moderation/comment-moderation';
import { GetManyRepositoryResponse } from './../../../types/general';
import { CommentModifyDto } from './dto/comment-modify.dto';
import { Injectable, Logger } from '@nestjs/common';
import {
  PostStatus,
  Prisma,
  CommentVersion,
  CommentModeration,
} from '@prisma-moderation-db/client';
import { PrismaService } from '../../../database/moderation/prisma.service';
import {
  ModerationCommentPaginationInput,
  ModerationCommentsFilterInput,
} from 'src/graphql';
import { cursorToNumber } from '../../../utils/cursor-pagination';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentService } from '../../../modules/comment/comment.service';
import getDeploymentConfig from '../../../config/deployment';

function countCommentVersionModerationDecisions(
  version: CommentVersion & {
    moderations: CommentModeration[];
  },
): Record<'ACCEPTED' | 'REJECTED', number> {
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
  private readonly config = getDeploymentConfig();

  constructor(
    private readonly prisma: PrismaService,
    private readonly commentService: CommentService,
  ) {}

  async getModerationCommentById(id: number) {
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

  async getHistoryofModerationCommentById(id: number) {
    const comments = [];

    let comment = await this.getModerationCommentById(id);
    while (comment.parent) {
      comments.unshift(comment.parent);
      comment = await this.getModerationCommentById(comment.parent.id);
    }

    return comments;
  }

  async getModerationComments(
    filter?: ModerationCommentsFilterInput,
    pagination?: ModerationCommentPaginationInput,
  ): Promise<
    GetManyRepositoryResponse<'moderationComments', CommentIncludesVersion>
  > {
    const { status, published, archived } = filter ?? {};

    const where: Prisma.CommentWhereInput = {
      status: status ?? undefined,
      published: published ?? undefined,
      archived: archived ?? undefined,
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
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: {
            moderations: { orderBy: { timestamp: 'desc' } },
          },
        },
      },
      skip: cursor ? 1 : undefined,
      cursor: cursor,
      take: (pagination?.limit ?? 10) * cursorDirection,
      orderBy: { id: 'asc' },
    });

    return { totalCount, moderationComments };
  }

  async getCommentModerationById(
    id: number,
  ): Promise<ModerationIncludesVersionIncludesComment> {
    return await this.prisma.commentModeration.findUnique({
      where: { id },
      include: { commentVersion: { include: { comment: true } } },
    });
  }

  async createModerationComment(
    data: CommentCreateDto,
  ): Promise<CommentIncludesVersion> {
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
        requiredModerations: this.config.moderatorCount,
      },
      include: { versions: { orderBy: { version: 'desc' } } },
    });
  }

  async getCommentVersionById(
    id: number,
  ): Promise<CommentVersion & { moderations: CommentModeration[] }> {
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
  ): Promise<CommentIncludesVersionIncludesModerations> {
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

      const commentVersion = await tx.commentVersion.findUnique({
        where: { id },
        include: { comment: true },
      });

      if (!commentVersion.latest) {
        throw new Error('Comment version is not the latest');
      }

      // Check that comment has pending status
      if (commentVersion.comment.status !== 'PENDING') {
        throw new Error('Comment status is not PENDING');
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

    const commentId = newCommentModeration.commentVersion.commentId;

    try {
      // Change status if there are enough moderations
      await this.approveComment(commentId);
    } catch (error) {
      this.logger.error(error);
    }

    // Return the new comment
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
  ): Promise<CommentIncludesVersionIncludesModerations> {
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

    const commentId = newCommentModeration.commentVersion.commentId;

    try {
      // Change status if there are enough moderations
      await this.rejectComment(commentId);
    } catch (error) {
      this.logger.error(error);
    }

    // Return the new comment
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
    hasContentWarning: boolean,
  ): Promise<CommentIncludesVersionIncludesModerations> {
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
            hasContentWarning,
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

  async rollbackModifiedModerationComment(
    commentId: number,
  ): Promise<CommentIncludesVersionIncludesModerations> {
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

  async renewCommentModeration(
    id: number,
    moderatorHash: string,
  ): Promise<CommentIncludesVersionIncludesModerations> {
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

  private async publishComment(commentId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findFirst({
        where: { id: commentId, commentIdInMainDb: null },
        include: {
          versions: {
            include: { moderations: { orderBy: { timestamp: 'desc' } } },
            orderBy: { version: 'desc' },
            take: 1,
          },
          parent: { select: { commentIdInMainDb: true } },
          post: { select: { postIdInMainDb: true } },
        },
      });
      const originalVersion = await tx.commentVersion.findFirst({
        where: { commentId: commentId },
        orderBy: { version: 'asc' },
      });
      const latestVersion = comment.versions[0];
      const moderated = originalVersion.content !== latestVersion.content;

      if (!comment) {
        throw new Error(
          `Comment with id ${commentId} not found. It is likely that is has already been published`,
        );
      }

      if (comment.status !== PostStatus.APPROVED) {
        throw new Error(
          `Comment with id ${commentId} does not have the 'approved' status`,
        );
      }

      const newCommentInMainDb = await this.commentService.createComment({
        content: comment.versions[0].content,
        authorHash: comment.authorHash,
        authorNickname: comment.authorNickname,
        postId: comment.post?.postIdInMainDb,
        parentId: comment.parent?.commentIdInMainDb,
        moderated,
        hasContentWarning: comment.versions[0].hasContentWarning,
      });

      this.logger.debug(
        'Created new comment in main db with id',
        newCommentInMainDb.id,
      );

      await tx.comment.update({
        where: { id: comment.id },
        data: {
          commentIdInMainDb: newCommentInMainDb.id,
          published: true,
          publishedAt: new Date(),
        },
      });

      this.logger.log(
        `Updated comment with id ${comment.id} to have main db id ${newCommentInMainDb.id}`,
      );
    });
  }

  private async archiveComment(commentId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Check that comment has the rejected status
      const comment = await tx.comment.findFirst({
        where: { id: commentId, archived: false },
        include: {
          versions: {
            include: { moderations: { orderBy: { timestamp: 'desc' } } },
            orderBy: { version: 'desc' },
            take: 1,
          },
        },
      });

      if (!comment) {
        throw new Error(
          `No comment with id ${comment.id} found. It is likely that is has already been archived.`,
        );
      }

      if (comment.status !== PostStatus.REJECTED) {
        throw new Error(
          `Comment with id ${commentId} does not have the 'rejected' status`,
        );
      }

      await tx.comment.update({
        where: { id: commentId },
        data: { archived: true, archivedAt: new Date() },
      });

      this.logger.debug(`Archived comment with id ${comment.id}`);
    });
  }

  async approveComment(commentId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Check if the comment has enough number of moderations
      const comment = await tx.comment.findUnique({
        where: { id: commentId },
        include: {
          post: { select: { postIdInMainDb: true } },
          parent: { select: { commentIdInMainDb: true } },
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
        throw new Error(
          `Unable to move comment to accepted status. Comment has ${decisionsCount.REJECTED} rejection(s)`,
        );
      }

      if (decisionsCount.ACCEPTED >= comment.requiredModerations) {
        await tx.comment.update({
          where: { id: commentId },
          data: { status: 'APPROVED' },
        });

        this.logger.log(
          `Finished approving comment with comment id ${commentId}`,
        );
      }
    });
  }

  async rejectComment(commentId: number) {
    await this.prisma.$transaction(async (tx) => {
      // Check if the comment has reached the rejection threshold
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

      if (decisionsCount.ACCEPTED > 0) {
        throw new Error(
          `Unable to move comment to rejected status. It has ${decisionsCount.ACCEPTED} approval(s)`,
        );
      }

      if (decisionsCount.REJECTED >= comment.requiredModerations) {
        await tx.comment.update({
          where: { id: commentId },
          data: { status: 'REJECTED' },
        });

        this.logger.log(
          `Finished rejecting comment with comment id ${commentId}`,
        );
      }
    });
  }

  async publishOrArchiveComments(): Promise<void> {
    const comments = await this.prisma.comment.findMany({
      where: {
        OR: [
          { status: 'APPROVED', commentIdInMainDb: null },
          { status: 'REJECTED', archived: false },
        ],
      },
      include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
    });

    let publishedCount = 0;
    let archivedCount = 0;

    const tasks = comments.map((comment) => {
      if (comment.status === 'APPROVED') {
        console.log(`Approving comment ${comment.id}`);
        return this.publishComment(comment.id)
          .then(() => {
            publishedCount++;
          })
          .catch((error) => {
            this.logger.debug(
              `Comment with post id ${comment.id} was not published. ${error.message}`,
            );
          });
      } else if (comment.status === 'REJECTED') {
        return this.archiveComment(comment.id)
          .then(() => {
            archivedCount++;
          })
          .catch((error) => {
            this.logger.debug(
              `Comment with comment id ${comment.id} was not archived. ${error.message}`,
            );
          });
      }
    });

    await Promise.all(tasks);

    this.logger.debug(
      `Number of comments published: ${publishedCount}, Number of comments archived: ${archivedCount}`,
    );
  }
}
