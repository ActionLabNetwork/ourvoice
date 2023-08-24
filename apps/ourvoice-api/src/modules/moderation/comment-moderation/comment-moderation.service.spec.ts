import {
  CommentIncludesVersion,
  CommentIncludesVersionIncludesModerationsIncludesPost,
  CommentWithAllItsRelations,
} from './../../../types/moderation/comment-moderation';
import { CommentModifyDto } from './dto/comment-modify.dto';
import { ModerationCommentStatus } from '../../../graphql';
import {
  Comment,
  CommentVersion,
  CommentModeration,
} from '@prisma-moderation-db/client';
import { PrismaService } from '../../../database/moderation/prisma.service';
import { CommentModerationService } from './comment-moderation.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentModerationRepository } from './comment-moderation.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommentCreateDto } from './dto/comment-create.dto';
import {
  CommentBuilder,
  CommentVersionBuilder,
  CommentModerationBuilder,
} from './comment-moderation.builder';
import { numberToCursor } from '../../../utils/cursor-pagination';

describe('CommentModerationService', () => {
  let commentModerationService: CommentModerationService;
  let commentModerationRepositoryMock: DeepMocked<CommentModerationRepository>;

  const dummyComment = new CommentBuilder()
    .withId(1)
    .withStatus('PENDING')
    .withRequiredModerations(1)
    .withAuthorHash('user1hash')
    .withAuthorNickname('correct_teal_duck')
    .withCommentIdInMainDb(null)
    .build() as Comment;

  const dummyVersion = new CommentVersionBuilder()
    .withId(1)
    .withContent('Test Content')
    .withVersion(1)
    .withAuthorHash('user1hash')
    .withAuthorNickname('correct_teal_duck')
    .withReason('')
    .withLatest(true)
    .withTimestamp(new Date('2023-04-13T10:00:00.000Z'))
    .withCommentId(1)
    .build() as CommentVersion;

  const dummyModeration = new CommentModerationBuilder()
    .withId(1)
    .withCommentVersionId(1)
    .withModeratorHash('moderator1hash')
    .withModeratorNickname('spiritual_olive_salmon')
    .withDecision('ACCEPTED')
    .withReason('This is as reason')
    .withTimestamp(new Date('2023-04-13T10:00:00.000Z'))
    .build() as CommentModeration;

  const dummyComments = [
    dummyComment,
    new CommentBuilder(dummyComment).withStatus('APPROVED').build(),
    new CommentBuilder(dummyComment).withStatus('REJECTED').build(),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentModerationService,
        {
          provide: CommentModerationRepository,
          useValue: createMock<CommentModerationRepository>(),
        },
        { provide: PrismaService, useValue: createMock<PrismaService>() },
      ],
    }).compile();

    commentModerationService = module.get<CommentModerationService>(
      CommentModerationService,
    );
    commentModerationRepositoryMock = module.get(CommentModerationRepository);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should create a comment', async () => {
    // Arrange
    const commentCreateInput = {
      title: 'Test Title',
      content: 'Test Content',
      categoryIds: [1, 3],
      files: ['https://example.com/file1.jpg'],
      requiredModerations: 1,
      authorHash: 'user1hash',
      authorNickname: 'correct_teal_duck',
    };

    commentModerationRepositoryMock.createModerationComment.mockResolvedValue(
      dummyComment as Comment & {
        versions: (CommentVersion & { moderations: CommentModeration[] })[];
      },
    );

    // Act
    const result = await commentModerationService.createComment(
      commentCreateInput,
    );

    // Assert
    expect(result).toEqual(dummyComment);
    expect(
      commentModerationRepositoryMock.createModerationComment,
    ).toHaveBeenCalledWith(commentCreateInput);
  });

  it('should fail to create comment without content', async () => {
    // Arrange
    const commentData: CommentCreateDto = {
      content: '',
      authorHash: 'Test Hash',
      authorNickname: 'Test Nickname',
    };

    // Act & Assert
    await expect(
      commentModerationService.createComment(commentData),
    ).rejects.toThrow(BadRequestException);
  });

  it('should fail to create comment without authorHash and authorNickname', async () => {
    // Arrange
    const commentData: CommentCreateDto = {
      content: 'Test Content',
      authorHash: null,
      authorNickname: null,
    };

    // Act & Assert
    await expect(
      commentModerationService.createComment(commentData),
    ).rejects.toThrow(BadRequestException);
  });

  it('should get a comment by ID', async () => {
    // Arrange
    const commentId = 1;

    commentModerationRepositoryMock.getModerationCommentById.mockResolvedValue(
      dummyComment as unknown as ReturnType<
        typeof commentModerationRepositoryMock.getModerationCommentById
      >,
    );

    // Act
    const result = await commentModerationService.getModerationCommentById(
      commentId,
    );

    // Assert
    expect(result).toEqual({ ...dummyComment });
    expect(
      commentModerationRepositoryMock.getModerationCommentById,
    ).toHaveBeenCalledWith(commentId);
  });

  it('should throw not found exception when calling getCommentById with an invalid id', async () => {
    // Arrange
    const commentId = 999;
    commentModerationRepositoryMock.getModerationCommentById.mockResolvedValue(
      null,
    );

    // Act & Assert
    await expect(
      commentModerationService.getModerationCommentById(commentId),
    ).rejects.toThrow(NotFoundException);
    expect(
      commentModerationRepositoryMock.getModerationCommentById,
    ).toHaveBeenCalledWith(commentId);
  });

  it('should get comments with filters and pagination', async () => {
    // Arrange
    commentModerationRepositoryMock.getModerationComments.mockResolvedValue({
      totalCount: 1,
      moderationComments: [dummyComments[0]] as CommentIncludesVersion[],
    });

    const filterData = { status: ModerationCommentStatus.PENDING };
    const paginationData = { cursor: 'MQ==', limit: 10 };
    const expectedResult = {
      edges: [
        {
          cursor: 'MQ==',
          node: {
            authorHash: 'user1hash',
            authorNickname: 'correct_teal_duck',
            id: 1,
            commentIdInMainDb: null,
            requiredModerations: 1,
            status: 'PENDING',
          },
        },
      ],
      pageInfo: {
        endCursor: 'MQ==',
        hasNextPage: false,
        startCursor: 'MQ==',
      },
      totalCount: 1,
    };
    // Act
    const result = await commentModerationService.getModerationComments(
      filterData,
      paginationData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error if both after and before fields are included', async () => {
    // Arrange
    const filterData = { status: ModerationCommentStatus.PENDING };
    const paginationData = { after: 'MQ==', before: 'MQ==' };

    // Act & Assert
    await expect(
      commentModerationService.getModerationComments(
        filterData,
        paginationData,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return next page when after field is included', async () => {
    // Arrange
    commentModerationRepositoryMock.getModerationComments.mockResolvedValue({
      totalCount: 6,
      moderationComments: [
        dummyComment,
        new CommentBuilder(dummyComment).withId(2).build(),
        new CommentBuilder(dummyComment).withId(3).build(),
      ] as CommentIncludesVersion[],
    });

    const paginationData = { after: numberToCursor(1), limit: 2 };
    const expectedResult = {
      edges: [
        {
          cursor: numberToCursor(1),
          node: {
            authorHash: 'user1hash',
            authorNickname: 'correct_teal_duck',
            id: 1,
            commentIdInMainDb: null,
            requiredModerations: 1,
            status: 'PENDING',
          },
        },
        {
          cursor: numberToCursor(2),
          node: {
            authorHash: 'user1hash',
            authorNickname: 'correct_teal_duck',
            id: 2,
            commentIdInMainDb: null,
            requiredModerations: 1,
            status: 'PENDING',
          },
        },
      ],
      pageInfo: {
        endCursor: numberToCursor(2),
        hasNextPage: true,
        hasPreviousPage: undefined,
        startCursor: numberToCursor(1),
      },
      totalCount: 6,
    };
    // Act
    const result = await commentModerationService.getModerationComments(
      null,
      paginationData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not return next page when after field is included but there is no next page', async () => {
    // Arrange
    commentModerationRepositoryMock.getModerationComments.mockResolvedValue({
      totalCount: 6,
      moderationComments: [] as CommentIncludesVersion[],
    });

    const paginationData = { after: numberToCursor(1), limit: 2 };
    const expectedResult = {
      edges: [],
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
        hasPreviousPage: undefined,
        startCursor: null,
      },
      totalCount: 6,
    };
    // Act
    const result = await commentModerationService.getModerationComments(
      null,
      paginationData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return previous page when before field is included', async () => {
    // Arrange
    commentModerationRepositoryMock.getModerationComments.mockResolvedValue({
      totalCount: 6,
      moderationComments: [
        dummyComment,
        new CommentBuilder(dummyComment).withId(2).build(),
        new CommentBuilder(dummyComment).withId(3).build(),
      ] as CommentIncludesVersion[],
    });

    const paginationData = { before: numberToCursor(3), limit: 2 };
    const expectedResult = {
      edges: [
        {
          cursor: numberToCursor(1),
          node: {
            authorHash: 'user1hash',
            authorNickname: 'correct_teal_duck',
            id: 1,
            commentIdInMainDb: null,
            requiredModerations: 1,
            status: 'PENDING',
          },
        },
        {
          cursor: numberToCursor(2),
          node: {
            authorHash: 'user1hash',
            authorNickname: 'correct_teal_duck',
            id: 2,
            commentIdInMainDb: null,
            requiredModerations: 1,
            status: 'PENDING',
          },
        },
      ],
      pageInfo: {
        endCursor: numberToCursor(2),
        hasNextPage: undefined,
        hasPreviousPage: true,
        startCursor: numberToCursor(1),
      },
      totalCount: 6,
    };
    // Act
    const result = await commentModerationService.getModerationComments(
      null,
      paginationData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not return previous page when before field is included but there is no previous page', async () => {
    // Arrange
    commentModerationRepositoryMock.getModerationComments.mockResolvedValue({
      totalCount: 6,
      moderationComments: [] as CommentIncludesVersion[],
    });

    const paginationData = { before: numberToCursor(1), limit: 2 };
    const expectedResult = {
      edges: [],
      pageInfo: {
        endCursor: null,
        hasNextPage: undefined,
        hasPreviousPage: false,
        startCursor: null,
      },
      totalCount: 6,
    };
    // Act
    const result = await commentModerationService.getModerationComments(
      null,
      paginationData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should approve a comment version', async () => {
    // Arrange
    const commentId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    commentModerationRepositoryMock.getModerationCommentById.mockResolvedValue(
      dummyComment as unknown as ReturnType<
        typeof commentModerationRepositoryMock.getModerationCommentById
      >,
    );

    commentModerationRepositoryMock.approveCommentVersion.mockResolvedValue(
      dummyComment as Comment & {
        versions: (CommentVersion & { moderations: CommentModeration[] })[];
      },
    );

    // Act
    const result = await commentModerationService.approveCommentVersion(
      commentId,
      moderatorHash,
      moderatorNickname,
      reason,
    );

    // Assert
    expect(result).toEqual({ ...dummyComment });
    expect(
      commentModerationRepositoryMock.approveCommentVersion,
    ).toHaveBeenCalledWith(commentId, moderatorHash, moderatorNickname, reason);
  });

  it('should throw not found exception when calling approveCommentVersion with an invalid id', async () => {
    // Arrange
    const commentId = 999;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    commentModerationRepositoryMock.getCommentVersionById.mockResolvedValue(
      null,
    );

    // Act & Assert
    await expect(
      commentModerationService.approveCommentVersion(
        commentId,
        moderatorHash,
        moderatorNickname,
        reason,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw bad request exception when calling approveCommentVersion on an outdated version', async () => {
    // Arrange
    const commentId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    commentModerationRepositoryMock.getCommentVersionById.mockResolvedValue(
      new CommentVersionBuilder(dummyVersion)
        .withLatest(false)
        .build() as CommentVersion & { moderations: CommentModeration[] },
    );

    // Act & Assert
    await expect(
      commentModerationService.approveCommentVersion(
        commentId,
        moderatorHash,
        moderatorNickname,
        reason,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject a comment version', async () => {
    // Arrange
    const commentId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    commentModerationRepositoryMock.getModerationCommentById.mockResolvedValue(
      dummyComment as unknown as ReturnType<
        typeof commentModerationRepositoryMock.getModerationCommentById
      >,
    );

    commentModerationRepositoryMock.rejectCommentVersion.mockResolvedValue(
      dummyComment as Comment & {
        versions: (CommentVersion & { moderations: CommentModeration[] })[];
      },
    );

    // Act
    const result = await commentModerationService.rejectCommentVersion(
      commentId,
      moderatorHash,
      moderatorNickname,
      reason,
    );

    // Assert
    expect(result).toEqual({ ...dummyComment });
    expect(
      commentModerationRepositoryMock.rejectCommentVersion,
    ).toHaveBeenCalledWith(commentId, moderatorHash, moderatorNickname, reason);
  });

  it('should throw not found exception when calling rejectCommentVersion with an invalid id', async () => {
    // Arrange
    const commentId = 999;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    commentModerationRepositoryMock.getCommentVersionById.mockResolvedValue(
      null,
    );

    // Act & Assert
    await expect(
      commentModerationService.rejectCommentVersion(
        commentId,
        moderatorHash,
        moderatorNickname,
        reason,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw bad request exception when calling rejectCommentVersion on an outdated version', async () => {
    // Arrange
    const commentId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    commentModerationRepositoryMock.getCommentVersionById.mockResolvedValue(
      new CommentVersionBuilder(dummyVersion)
        .withLatest(false)
        .build() as CommentVersion & { moderations: CommentModeration[] },
    );

    // Act & Assert
    await expect(
      commentModerationService.rejectCommentVersion(
        commentId,
        moderatorHash,
        moderatorNickname,
        reason,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should modify a comment in moderation', async () => {
    // Arrange
    const commentId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    const modifyData: CommentModifyDto = {
      content: 'Test Content',
    };

    commentModerationRepositoryMock.getCommentVersionById.mockResolvedValue(
      dummyVersion as CommentVersion & { moderations: CommentModeration[] },
    );

    commentModerationRepositoryMock.modifyModerationComment.mockResolvedValue(
      dummyComment as Comment & {
        versions: (CommentVersion & { moderations: CommentModeration[] })[];
      },
    );

    // Act
    const result = await commentModerationService.modifyModerationComment(
      commentId,
      moderatorHash,
      moderatorNickname,
      reason,
      modifyData,
      false,
    );

    // Assert
    expect(result).toEqual({ ...dummyComment });
    expect(
      commentModerationRepositoryMock.modifyModerationComment,
    ).toHaveBeenCalledWith(
      commentId,
      moderatorHash,
      moderatorNickname,
      reason,
      modifyData,
      false,
    );
  });

  it('should throw bad request exception when calling modifyModerationComment with invalid validation for data', async () => {
    // Arrange
    const commentId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';
    const modifyData: CommentModifyDto = {
      content: '', // Empty content should throw error
    };

    commentModerationRepositoryMock.getCommentVersionById.mockResolvedValue(
      dummyVersion as CommentVersion & { moderations: CommentModeration[] },
    );

    commentModerationRepositoryMock.modifyModerationComment.mockResolvedValue(
      dummyComment as Comment & {
        versions: (CommentVersion & { moderations: CommentModeration[] })[];
      },
    );

    // Act & Assert
    await expect(
      commentModerationService.modifyModerationComment(
        commentId,
        moderatorHash,
        moderatorNickname,
        reason,
        modifyData,
        false,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw bad request exception when calling modifyModerationComment with no reason', async () => {
    // Arrange
    const commentId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = ''; // Empty reason should throw error
    const modifyData: CommentModifyDto = {
      content: 'Test Content',
    };

    commentModerationRepositoryMock.getCommentVersionById.mockResolvedValue(
      dummyVersion as CommentVersion & { moderations: CommentModeration[] },
    );

    commentModerationRepositoryMock.modifyModerationComment.mockResolvedValue(
      dummyComment as Comment & {
        versions: (CommentVersion & { moderations: CommentModeration[] })[];
      },
    );

    // Act & Assert
    await expect(
      commentModerationService.modifyModerationComment(
        commentId,
        moderatorHash,
        moderatorNickname,
        reason,
        modifyData,
        false,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw not found exception when calling modifyModerationComment with an invalid id', async () => {
    // Arrange
    const commentId = 999;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';
    const modifyData: CommentModifyDto = {
      content: 'Test Content',
    };

    commentModerationRepositoryMock.getCommentVersionById.mockResolvedValue(
      null,
    );

    // Act & Assert
    await expect(
      commentModerationService.modifyModerationComment(
        commentId,
        moderatorHash,
        moderatorNickname,
        reason,
        modifyData,
        false,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  // TODO: Update builder to allow moderation to receive comment
  // it('should renew comment version', async () => {
  //   commentModerationRepositoryMock.getCommentModerationById.mockResolvedValue(
  //     dummyModeration as CommentModeration & {
  //       commentVersion: CommentVersion & { comment: Comment };
  //     },
  //   );

  //   commentModerationRepositoryMock.renewCommentModeration.mockResolvedValue(
  //     dummyComment as Comment & {
  //       versions: (CommentVersion & { moderations: CommentModeration[] })[];
  //     },
  //   );

  //   const result = await commentModerationService.renewCommentModeration(
  //     dummyModeration.id,
  //     'moderator1hash',
  //   );

  //   expect(result).toEqual({ ...dummyComment });
  //   expect(
  //     commentModerationRepositoryMock.renewCommentModeration,
  //   ).toHaveBeenCalledWith(dummyModeration.id, 'moderator1hash');
  // });

  it('should throw not found exception when calling renewCommentModeration with an invalid id', async () => {
    commentModerationRepositoryMock.getCommentModerationById.mockResolvedValue(
      null,
    );

    commentModerationRepositoryMock.renewCommentModeration.mockResolvedValue(
      dummyComment as Comment & {
        versions: (CommentVersion & { moderations: CommentModeration[] })[];
      },
    );

    await expect(
      commentModerationService.renewCommentModeration(
        dummyModeration.id,
        'moderator1hash',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it("should throw bad request exception when trying to renew a moderation that doesn't match the moderator hash", async () => {
    commentModerationRepositoryMock.getCommentModerationById.mockResolvedValue(
      dummyModeration as CommentModeration & {
        commentVersion: CommentVersion & { comment: Comment };
      },
    );

    commentModerationRepositoryMock.renewCommentModeration.mockResolvedValue(
      dummyComment as Comment & {
        versions: (CommentVersion & { moderations: CommentModeration[] })[];
      },
    );

    await expect(
      commentModerationService.renewCommentModeration(
        dummyModeration.id,
        'moderator2hash',
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
