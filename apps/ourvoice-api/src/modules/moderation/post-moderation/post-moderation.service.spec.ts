import { PostIncludesVersion } from './../../../types/moderation/post-moderation';
import { PostModifyDto } from './dto/post-modify.dto';
import { ModerationPostStatus } from '../../../graphql';
import {
  Post,
  PostVersion,
  PostModeration,
} from '@prisma-moderation-db/client';
import { PrismaService } from '../../../database/moderation/prisma.service';
import { PostModerationService } from './post-moderation.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PostModerationRepository } from './post-moderation.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostCreateDto } from './dto/post-create.dto';
import {
  PostBuilder,
  PostVersionBuilder,
  PostModerationBuilder,
} from './post-moderation.builder';
import { numberToCursor } from '../../../utils/cursor-pagination';

describe('PostModerationService', () => {
  let postModerationService: PostModerationService;
  let postModerationRepositoryMock: DeepMocked<PostModerationRepository>;

  const dummyModeration = new PostModerationBuilder()
    .withId(1)
    .withPostVersionId(1)
    .withModeratorHash('moderator1hash')
    .withModeratorNickname('spiritual_olive_salmon')
    .withDecision('ACCEPTED')
    .withReason('This is as reason')
    .withTimestamp(new Date('2023-04-13T10:00:00.000Z'))
    .build() as PostModeration;

  const dummyVersion = new PostVersionBuilder()
    .withId(1)
    .withTitle('Test Title')
    .withContent('Test Content')
    .withCategoryIds([1, 3])
    .withFiles(['https://example.com/file1.jpg'])
    .withVersion(1)
    .withAuthorHash('user1hash')
    .withAuthorNickname('correct_teal_duck')
    .withReason('')
    .withLatest(true)
    .withTimestamp(new Date('2023-04-13T10:00:00.000Z'))
    .withPostId(1)
    .build() as PostVersion;

  const dummyPost = new PostBuilder()
    .withId(1)
    .withStatus('PENDING')
    .withRequiredModerations(1)
    .withAuthorHash('user1hash')
    .withAuthorNickname('correct_teal_duck')
    .withPostIdInMainDb(null)
    .build() as Post & {
    versions: (PostVersion & { moderations: PostModeration[] })[];
  };

  const dummyPosts = [
    dummyPost,
    new PostBuilder(dummyPost).withStatus('APPROVED').build(),
    new PostBuilder(dummyPost).withStatus('REJECTED').build(),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostModerationService,
        {
          provide: PostModerationRepository,
          useValue: createMock<PostModerationRepository>(),
        },
        { provide: PrismaService, useValue: createMock<PrismaService>() },
      ],
    }).compile();

    postModerationService = module.get<PostModerationService>(
      PostModerationService,
    );
    postModerationRepositoryMock = module.get(PostModerationRepository);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should create a post', async () => {
    // Arrange
    const postCreateInput = {
      title: 'Test Title',
      content: 'Test Content',
      categoryIds: [1, 3],
      files: ['https://example.com/file1.jpg'],
      requiredModerations: 1,
      authorHash: 'user1hash',
      authorNickname: 'correct_teal_duck',
    };

    postModerationRepositoryMock.createModerationPost.mockResolvedValue(
      dummyPost,
    );

    // Act
    const result = await postModerationService.createPost(postCreateInput);

    // Assert
    expect(result).toEqual(dummyPost);
    expect(
      postModerationRepositoryMock.createModerationPost,
    ).toHaveBeenCalledWith(postCreateInput);
  });

  it('should fail to create post without title and content', async () => {
    // Arrange
    const postData: PostCreateDto = {
      title: '',
      content: '',
      authorHash: 'Test Hash',
      authorNickname: 'Test Nickname',
      categoryIds: [1],
    };

    // Act & Assert
    await expect(postModerationService.createPost(postData)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should fail to create post without authorHash and authorNickname', async () => {
    // Arrange
    const postData: PostCreateDto = {
      title: 'Test Title',
      content: 'Test Content',
      authorHash: null,
      authorNickname: null,
      categoryIds: [1],
    };

    // Act & Assert
    await expect(postModerationService.createPost(postData)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should fail create post without 1 to 2 categories', async () => {
    // Arrange
    const noCategoryData: PostCreateDto = {
      title: 'Test Title',
      content: 'Test Content',
      authorHash: 'Test Hash',
      authorNickname: 'Test Nickname',
      categoryIds: [],
    };

    const validPostData: PostCreateDto = {
      title: 'Test Title',
      content: 'Test Content',
      authorHash: 'Test Hash',
      authorNickname: 'Test Nickname',
      categoryIds: [1],
    };

    const tooManyCategoriesData: PostCreateDto = {
      title: 'Test Title',
      content: 'Test Content',
      authorHash: 'Test Hash',
      authorNickname: 'Test Nickname',
      categoryIds: [1, 2, 3],
    };

    // Act & Assert
    await expect(
      postModerationService.createPost(noCategoryData),
    ).rejects.toThrow(BadRequestException);
    await expect(
      postModerationService.createPost(validPostData),
    ).resolves.not.toThrow();
    await expect(
      postModerationService.createPost(tooManyCategoriesData),
    ).rejects.toThrow(BadRequestException);
  });

  it('should get a post by ID', async () => {
    // Arrange
    const postId = 1;
    postModerationRepositoryMock.getModerationPostById.mockResolvedValue(
      dummyPost,
    );

    // Act
    const result = await postModerationService.getModerationPostById(postId);

    // Assert
    expect(result).toEqual({ ...dummyPost });
    expect(
      postModerationRepositoryMock.getModerationPostById,
    ).toHaveBeenCalledWith(postId);
  });

  it('should throw not found exception when calling getPostById with an invalid id', async () => {
    // Arrange
    const postId = 999;
    postModerationRepositoryMock.getModerationPostById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      postModerationService.getModerationPostById(postId),
    ).rejects.toThrow(NotFoundException);
    expect(
      postModerationRepositoryMock.getModerationPostById,
    ).toHaveBeenCalledWith(postId);
  });

  it('should get posts with filters and pagination', async () => {
    // Arrange
    postModerationRepositoryMock.getModerationPosts.mockResolvedValue({
      totalCount: 1,
      moderationPosts: [dummyPosts[0]] as PostIncludesVersion[],
    });

    const filterData = { status: ModerationPostStatus.PENDING };
    const paginationData = { cursor: 'MQ==', limit: 10 };
    const expectedResult = {
      edges: [
        {
          cursor: 'MQ==',
          node: {
            authorHash: 'user1hash',
            authorNickname: 'correct_teal_duck',
            id: 1,
            postIdInMainDb: null,
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
    const result = await postModerationService.getModerationPosts(
      filterData,
      paginationData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error if both after and before fields are included', async () => {
    // Arrange
    const filterData = { status: ModerationPostStatus.PENDING };
    const paginationData = { after: 'MQ==', before: 'MQ==' };

    // Act & Assert
    await expect(
      postModerationService.getModerationPosts(filterData, paginationData),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return next page when after field is included', async () => {
    // Arrange
    postModerationRepositoryMock.getModerationPosts.mockResolvedValue({
      totalCount: 6,
      moderationPosts: [
        dummyPost,
        new PostBuilder(dummyPost).withId(2).build(),
        new PostBuilder(dummyPost).withId(3).build(),
      ] as PostIncludesVersion[],
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
            postIdInMainDb: null,
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
            postIdInMainDb: null,
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
    const result = await postModerationService.getModerationPosts(
      null,
      paginationData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not return next page when after field is included but there is no next page', async () => {
    // Arrange
    postModerationRepositoryMock.getModerationPosts.mockResolvedValue({
      totalCount: 6,
      moderationPosts: [] as PostIncludesVersion[],
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
    const result = await postModerationService.getModerationPosts(
      null,
      paginationData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return previous page when before field is included', async () => {
    // Arrange
    postModerationRepositoryMock.getModerationPosts.mockResolvedValue({
      totalCount: 6,
      moderationPosts: [
        dummyPost,
        new PostBuilder(dummyPost).withId(2).build(),
        new PostBuilder(dummyPost).withId(3).build(),
      ] as PostIncludesVersion[],
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
            postIdInMainDb: null,
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
            postIdInMainDb: null,
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
    const result = await postModerationService.getModerationPosts(
      null,
      paginationData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should not return previous page when before field is included but there is no previous page', async () => {
    // Arrange
    postModerationRepositoryMock.getModerationPosts.mockResolvedValue({
      totalCount: 6,
      moderationPosts: [] as PostIncludesVersion[],
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
    const result = await postModerationService.getModerationPosts(
      null,
      paginationData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should approve a post version', async () => {
    // Arrange
    const postId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    postModerationRepositoryMock.getModerationPostById.mockResolvedValue(
      dummyPost,
    );

    postModerationRepositoryMock.approvePostVersion.mockResolvedValue(
      dummyPost,
    );

    // Act
    const result = await postModerationService.approvePostVersion(
      postId,
      moderatorHash,
      moderatorNickname,
      reason,
    );

    // Assert
    expect(result).toEqual({ ...dummyPost });
    expect(
      postModerationRepositoryMock.approvePostVersion,
    ).toHaveBeenCalledWith(postId, moderatorHash, moderatorNickname, reason);
  });

  it('should throw not found exception when calling approvePostVersion with an invalid id', async () => {
    // Arrange
    const postId = 999;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    postModerationRepositoryMock.getPostVersionById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      postModerationService.approvePostVersion(
        postId,
        moderatorHash,
        moderatorNickname,
        reason,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw bad request exception when calling approvePostVersion on an outdated version', async () => {
    // Arrange
    const postId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    postModerationRepositoryMock.getPostVersionById.mockResolvedValue(
      new PostVersionBuilder(dummyVersion)
        .withLatest(false)
        .build() as PostVersion & { moderations: PostModeration[] },
    );

    // Act & Assert
    await expect(
      postModerationService.approvePostVersion(
        postId,
        moderatorHash,
        moderatorNickname,
        reason,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject a post version', async () => {
    // Arrange
    const postId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    postModerationRepositoryMock.getModerationPostById.mockResolvedValue(
      dummyPost,
    );

    postModerationRepositoryMock.rejectPostVersion.mockResolvedValue(dummyPost);

    // Act
    const result = await postModerationService.rejectPostVersion(
      postId,
      moderatorHash,
      moderatorNickname,
      reason,
    );

    // Assert
    expect(result).toEqual({ ...dummyPost });
    expect(postModerationRepositoryMock.rejectPostVersion).toHaveBeenCalledWith(
      postId,
      moderatorHash,
      moderatorNickname,
      reason,
    );
  });

  it('should throw not found exception when calling rejectPostVersion with an invalid id', async () => {
    // Arrange
    const postId = 999;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    postModerationRepositoryMock.getPostVersionById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      postModerationService.rejectPostVersion(
        postId,
        moderatorHash,
        moderatorNickname,
        reason,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw bad request exception when calling rejectPostVersion on an outdated version', async () => {
    // Arrange
    const postId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    postModerationRepositoryMock.getPostVersionById.mockResolvedValue(
      new PostVersionBuilder(dummyVersion)
        .withLatest(false)
        .build() as PostVersion & { moderations: PostModeration[] },
    );

    // Act & Assert
    await expect(
      postModerationService.rejectPostVersion(
        postId,
        moderatorHash,
        moderatorNickname,
        reason,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should modify a post in moderation', async () => {
    // Arrange
    const postId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';

    const modifyData: PostModifyDto = {
      title: 'Test Title',
      content: 'Test Content',
      categoryIds: [1, 2],
      files: ['bucketkey1', 'bucketkey2'],
    };

    postModerationRepositoryMock.getPostVersionById.mockResolvedValue(
      dummyVersion as PostVersion & { moderations: PostModeration[] },
    );

    postModerationRepositoryMock.modifyModerationPost.mockResolvedValue(
      dummyPost,
    );

    // Act
    const result = await postModerationService.modifyModerationPost(
      postId,
      moderatorHash,
      moderatorNickname,
      reason,
      modifyData,
    );

    // Assert
    expect(result).toEqual({ ...dummyPost });
    expect(
      postModerationRepositoryMock.modifyModerationPost,
    ).toHaveBeenCalledWith(
      postId,
      moderatorHash,
      moderatorNickname,
      reason,
      modifyData,
    );
  });

  it('should throw bad request exception when calling modifyModerationPost with invalid validation for data', async () => {
    // Arrange
    const postId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';
    const modifyData: PostModifyDto = {
      title: '', // Empty title should throw error
      content: 'Test Content',
      categoryIds: [1, 2],
      files: ['bucketkey1', 'bucketkey2'],
    };

    postModerationRepositoryMock.getPostVersionById.mockResolvedValue(
      dummyVersion as PostVersion & { moderations: PostModeration[] },
    );

    postModerationRepositoryMock.modifyModerationPost.mockResolvedValue(
      dummyPost,
    );

    // Act & Assert
    await expect(
      postModerationService.modifyModerationPost(
        postId,
        moderatorHash,
        moderatorNickname,
        reason,
        modifyData,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw bad request exception when calling modifyModerationPost with no reason', async () => {
    // Arrange
    const postId = 1;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = ''; // Empty reason should throw error
    const modifyData: PostModifyDto = {
      title: 'Test Title',
      content: 'Test Content',
      categoryIds: [1, 2],
      files: ['bucketkey1', 'bucketkey2'],
    };

    postModerationRepositoryMock.getPostVersionById.mockResolvedValue(
      dummyVersion as PostVersion & { moderations: PostModeration[] },
    );

    postModerationRepositoryMock.modifyModerationPost.mockResolvedValue(
      dummyPost,
    );

    // Act & Assert
    await expect(
      postModerationService.modifyModerationPost(
        postId,
        moderatorHash,
        moderatorNickname,
        reason,
        modifyData,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw not found exception when calling modifyModerationPost with an invalid id', async () => {
    // Arrange
    const postId = 999;
    const moderatorHash = 'moderator1hash';
    const moderatorNickname = 'correct_teal_duck';
    const reason = 'Test Reason';
    const modifyData: PostModifyDto = {
      title: 'Test Title',
      content: 'Test Content',
      categoryIds: [1, 2],
      files: ['bucketkey1', 'bucketkey2'],
    };

    postModerationRepositoryMock.getPostVersionById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      postModerationService.modifyModerationPost(
        postId,
        moderatorHash,
        moderatorNickname,
        reason,
        modifyData,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should renew post version', async () => {
    postModerationRepositoryMock.getPostModerationById.mockResolvedValue(
      dummyModeration as PostModeration & { postVersion: PostVersion },
    );

    postModerationRepositoryMock.renewPostModeration.mockResolvedValue(
      dummyPost,
    );

    const result = await postModerationService.renewPostModeration(
      dummyModeration.id,
      'moderator1hash',
    );

    expect(result).toEqual({ ...dummyPost });
    expect(
      postModerationRepositoryMock.renewPostModeration,
    ).toHaveBeenCalledWith(dummyModeration.id, 'moderator1hash');
  });

  it('should throw not found exception when calling renewPostModeration with an invalid id', async () => {
    postModerationRepositoryMock.getPostModerationById.mockResolvedValue(null);

    postModerationRepositoryMock.renewPostModeration.mockResolvedValue(
      dummyPost,
    );

    await expect(
      postModerationService.renewPostModeration(
        dummyModeration.id,
        'moderator1hash',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it("should throw bad request exception when trying to renew a moderation that doesn't match the moderator hash", async () => {
    postModerationRepositoryMock.getPostModerationById.mockResolvedValue(
      dummyModeration as PostModeration & { postVersion: PostVersion },
    );

    postModerationRepositoryMock.renewPostModeration.mockResolvedValue(
      dummyPost,
    );

    await expect(
      postModerationService.renewPostModeration(
        dummyModeration.id,
        'moderator2hash',
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
