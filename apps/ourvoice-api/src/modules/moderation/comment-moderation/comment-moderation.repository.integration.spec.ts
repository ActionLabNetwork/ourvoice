import {
  PostModeration,
  CommentModeration,
  PostStatus,
  PostVersion,
  CommentVersion,
  Decision,
} from '@prisma-moderation-db/client';
import { numberToCursor } from '../../../utils/cursor-pagination';
import { seedDb } from '../../../../prisma-moderation/seed';
import { PrismaService } from '../../../database/moderation/prisma.service';
import { Test } from '@nestjs/testing';
import { CommentModule } from './../../comment/comment.module';
import { CommentModerationRepository } from './comment-moderation.repository';
import {
  CommentBuilder,
  CommentModerationBuilder,
  CommentVersionBuilder,
} from './comment-moderation.builder';
import { ModerationCommentStatus } from '../../../graphql';
import {
  PostBuilder,
  PostModerationBuilder,
  PostVersionBuilder,
} from '../post-moderation/post-moderation.builder';

describe('CommentRepository', () => {
  const TOTAL_COMMENTS = 60;
  const COMMENTS_PER_PAGE = 10;

  const pModeration1 = new PostModerationBuilder()
    .withId(1)
    .withPostVersionId(1)
    .withModeratorHash('moderator1hash')
    .withModeratorNickname('spiritual_olive_salmon')
    .withDecision(Decision.ACCEPTED)
    .withReason('Moderation reason for post 1')
    .withTimestamp(new Date('2023-04-13T10:40:00.000Z'))
    .build() as PostModeration;

  const pModeration2 = new PostModerationBuilder(pModeration1)
    .withId(2)
    .withTimestamp(new Date('2023-04-14T10:40:00.000Z'))
    .build() as PostModeration;

  const pModeration3 = new PostModerationBuilder(pModeration2)
    .withId(3)
    .withTimestamp(new Date('2023-04-15T10:40:00.000Z'))
    .build() as PostModeration;

  const pModeration4 = new PostModerationBuilder()
    .withId(4)
    .withPostVersionId(2)
    .withModeratorHash('moderator2hash')
    .withModeratorNickname('sympathetic_jade_landfowl')
    .withDecision(Decision.REJECTED)
    .withReason('Moderation reason for post 2')
    .withTimestamp(new Date('2023-04-14T10:40:00.000Z'))
    .build() as PostModeration;

  const pModeration5 = new PostModerationBuilder(pModeration4)
    .withId(5)
    .withTimestamp(new Date('2023-04-15T10:40:00.000Z'))
    .build() as PostModeration;

  const pModeration6 = new PostModerationBuilder(pModeration5)
    .withId(6)
    .withTimestamp(new Date('2023-04-16T10:40:00.000Z'))
    .build() as PostModeration;

  const pModeration7 = new PostModerationBuilder()
    .withId(7)
    .withPostVersionId(3)
    .withModeratorHash('moderator3hash')
    .withModeratorNickname('charming_rose_hummingbird')
    .withDecision(Decision.ACCEPTED)
    .withReason('Moderation reason for post 3')
    .withTimestamp(new Date('2023-04-15T10:40:00.000Z'))
    .build() as PostModeration;

  const pModeration8 = new PostModerationBuilder(pModeration7)
    .withId(8)
    .withTimestamp(new Date('2023-04-16T10:40:00.000Z'))
    .build() as PostModeration;

  const pModeration9 = new PostModerationBuilder(pModeration8)
    .withId(9)
    .withTimestamp(new Date('2023-04-17T10:40:00.000Z'))
    .build() as PostModeration;

  const pVersion1 = new PostVersionBuilder()
    .withId(1)
    .withTitle('Post 1')
    .withContent('This is the content of post 1. This is version 1')
    .withCategoryIds([1, 2])
    .withFiles(null)
    .withVersion(1)
    .withReason('')
    .withAuthorHash('user1hash')
    .withAuthorNickname('user1hash')
    .withLatest(false)
    .withTimestamp(new Date('2023-04-13T10:00:00.000Z'))
    .withPostId(1)
    .withModerations([pModeration3, pModeration2, pModeration1])
    .build() as PostVersion & { moderations: PostModeration[] };

  const pVersion2 = new PostVersionBuilder(pVersion1)
    .withId(2)
    .withContent('This is the content of post 1. This is version 2')
    .withVersion(2)
    .withReason('Modified by moderator')
    .withTimestamp(new Date('2023-04-14T10:00:00.000Z'))
    .withModerations([pModeration6, pModeration5, pModeration4])
    .build() as PostVersion & { moderations: PostModeration[] };

  const pVersion3 = new PostVersionBuilder(pVersion2)
    .withId(3)
    .withContent('This is the content of post 1. This is version 3')
    .withVersion(3)
    .withLatest(true)
    .withTimestamp(new Date('2023-04-15T10:00:00.000Z'))
    .withModerations([pModeration9, pModeration8, pModeration7])
    .build() as PostVersion & { moderations: PostModeration[] };

  const firstPost = new PostBuilder()
    .withId(1)
    .withStatus(PostStatus.APPROVED)
    .withRequiredModerations(1)
    .withAuthorHash('user1hash')
    .withAuthorNickname('correct_teal_duck')
    .withPostIdInMainDb(1)
    .withVersions([pVersion3])
    .build();

  const moderation1 = new CommentModerationBuilder()
    .withId(1)
    .withCommentVersionId(1)
    .withModeratorHash('moderator1hash')
    .withModeratorNickname('spiritual_olive_salmon')
    .withDecision(Decision.ACCEPTED)
    .withReason('Moderation reason for comment on post 1')
    .withTimestamp(new Date('2023-04-13T10:40:00.000Z'))
    .build() as CommentModeration;

  const moderation2 = new CommentModerationBuilder(moderation1)
    .withId(2)
    .withCommentVersionId(3)
    .withTimestamp(new Date('2023-04-14T10:40:00.000Z'))
    .build() as CommentModeration;

  const version1 = new CommentVersionBuilder()
    .withId(1)
    .withContent('This is a comment on post 1. This is version 1')
    .withVersion(1)
    .withReason('')
    .withAuthorHash('commentAuthor1hash')
    .withAuthorNickname('commentAuthor1hash')
    .withLatest(false)
    .withTimestamp(new Date('2023-04-13T10:30:00.000Z'))
    .withCommentId(1)
    .withModerations([moderation1])
    .build() as CommentVersion & { moderations: CommentModeration[] };

  const version2 = new CommentVersionBuilder(version1)
    .withId(2)
    .withContent('This is a comment on post 1. This is version 2')
    .withVersion(2)
    .withReason('Modified by moderator')
    .withTimestamp(new Date('2023-04-14T10:30:00.000Z'))
    .withModerations([])
    .build() as CommentVersion & { moderations: CommentModeration[] };

  const version3 = new CommentVersionBuilder(version2)
    .withId(3)
    .withContent('This is a comment on post 1. This is version 3')
    .withVersion(3)
    .withLatest(true)
    .withTimestamp(new Date('2023-04-15T10:30:00.000Z'))
    .withModerations([moderation2])
    .build() as CommentVersion & { moderations: CommentModeration[] };

  let commentModerationRepository: CommentModerationRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    await seedDb();
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CommentModule],
      providers: [PrismaService, CommentModerationRepository],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    commentModerationRepository = moduleRef.get(CommentModerationRepository);
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests are done
    await prismaService.$disconnect();
  });

  it('should get a comment by id', async () => {
    // Arrange
    const firstComment = new CommentBuilder()
      .withId(1)
      .withStatus(PostStatus.APPROVED)
      .withRequiredModerations(1)
      .withAuthorHash('commentAuthor1hash')
      .withAuthorNickname('correct_teal_duck')
      .withCommentIdInMainDb(1)
      .withVersions([version3, version2, version1])
      .withPost(firstPost)
      .withPostId(1)
      .withParent(null)
      .withParentId(null)
      .build();

    // Act
    const comment = await commentModerationRepository.getModerationCommentById(
      1,
    );

    // Assert
    expect(comment).toEqual(firstComment);
  });

  it('should return null for non existent comment id', async () => {
    // Act
    const comment = await commentModerationRepository.getModerationCommentById(
      999,
    );

    // Assert
    expect(comment).toEqual(null);
  });

  it('should return pending moderation comments', async () => {
    // Act
    const comments = await commentModerationRepository.getModerationComments(
      { status: ModerationCommentStatus.PENDING },
      null,
    );

    // Assert
    expect(comments.totalCount).toEqual(20);
    expect(comments.moderationComments.length).toEqual(10);
  });

  it('should return approved moderation comments', async () => {
    // Act
    const comments = await commentModerationRepository.getModerationComments(
      { status: ModerationCommentStatus.APPROVED },
      null,
    );

    // Assert
    expect(comments.totalCount).toEqual(20);
    expect(comments.moderationComments.length).toEqual(10);
  });

  it('should return rejected moderation comments', async () => {
    // Act
    const comments = await commentModerationRepository.getModerationComments(
      { status: ModerationCommentStatus.REJECTED },
      null,
    );

    // Assert
    expect(comments.totalCount).toEqual(20);
    expect(comments.moderationComments.length).toEqual(10);
  });

  it('should return 10 comments as default when no limit is provided', async () => {
    // Act
    const comments = await commentModerationRepository.getModerationComments();

    // Assert
    expect(comments.totalCount).toEqual(TOTAL_COMMENTS);
    expect(comments.moderationComments.length).toEqual(COMMENTS_PER_PAGE);
  });

  it('should return 5 comments when limit is 5', async () => {
    // Act
    const comments = await commentModerationRepository.getModerationComments(
      null,
      {
        limit: 5,
      },
    );

    // Assert
    expect(comments.totalCount).toEqual(TOTAL_COMMENTS);
    expect(comments.moderationComments.length).toEqual(5);
  });

  it('should succeed forward pagination', async () => {
    // Act
    const comments = await commentModerationRepository.getModerationComments(
      null,
      {
        limit: 5,
      },
    );
    const nextComments =
      await commentModerationRepository.getModerationComments(null, {
        after: numberToCursor(comments.moderationComments[4].id),
        limit: 5,
      });

    // Assert
    expect(comments.totalCount).toEqual(TOTAL_COMMENTS);
    expect(comments.moderationComments.length).toEqual(5);
    expect(nextComments.moderationComments.length).toEqual(5);
    expect(nextComments.moderationComments[0].id).toEqual(6);
  });

  it('should return empty array due to invalid cursor (non-existent id)', async () => {
    // Act
    const comments = await commentModerationRepository.getModerationComments(
      null,
      {
        limit: 5,
      },
    );
    const nextComments =
      await commentModerationRepository.getModerationComments(null, {
        after: numberToCursor(999),
        limit: 5,
      });

    expect(comments.totalCount).toEqual(TOTAL_COMMENTS);
    expect(comments.moderationComments.length).toEqual(5);
    expect(nextComments.totalCount).toEqual(TOTAL_COMMENTS);
    expect(nextComments.moderationComments.length).toEqual(0);
  });

  it('should throw error due to invalid cursor (non-existent cursor)', async () => {
    // Act & Assert
    const comments = await commentModerationRepository.getModerationComments(
      null,
      {
        limit: 5,
      },
    );

    expect(comments.totalCount).toEqual(TOTAL_COMMENTS);
    expect(comments.moderationComments.length).toEqual(5);

    await expect(
      commentModerationRepository.getModerationComments(null, {
        after: 'asdadasdas',
        limit: 5,
      }),
    ).rejects.toThrowError();
  });

  it('should succeed backward pagination', async () => {
    // Act
    const posts = await commentModerationRepository.getModerationComments(
      null,
      {
        limit: 2,
      },
    );
    const nextPosts = await commentModerationRepository.getModerationComments(
      null,
      {
        after: numberToCursor(posts.moderationComments.at(-1).id),
        limit: 2,
      },
    );
    const prevPosts = await commentModerationRepository.getModerationComments(
      null,
      {
        before: numberToCursor(nextPosts.moderationComments[0].id),
        limit: 2,
      },
    );

    // Assert
    expect(posts.totalCount).toEqual(TOTAL_COMMENTS);
    expect(posts.moderationComments.length).toEqual(2);
    expect(nextPosts.moderationComments.length).toEqual(2);
    expect(nextPosts.moderationComments[0].id).toEqual(3);
    expect(prevPosts.moderationComments.length).toEqual(2);
    expect(prevPosts.moderationComments[0].id).toEqual(1);
  });

  it('should create a new comment for a published post', async () => {
    // Arrange
    const commentData = {
      content: 'Test Content',
      authorNickname: 'Test Hash',
      authorHash: 'Test Nickname',
      postId: 1,
      requiredModerations: 1,
    };

    // Act
    const createdComment =
      await commentModerationRepository.createModerationComment(commentData);

    // Assert
    expect(createdComment.status).toEqual(PostStatus.PENDING);
    expect(createdComment.requiredModerations).toEqual(
      commentData.requiredModerations,
    );
    expect(createdComment.versions.length).toEqual(1);
    expect(createdComment.versions[0].content).toEqual(commentData.content);
    expect(createdComment.versions[0].authorHash).toEqual(
      commentData.authorHash,
    );
    expect(createdComment.versions[0].authorNickname).toEqual(
      commentData.authorNickname,
    );
  });

  it('should fail to create a new comment if post is not found in main db', async () => {
    // Arrange
    const commentData = {
      content: 'Test Content',
      authorNickname: 'Test Hash',
      authorHash: 'Test Nickname',
      postId: 999,
      requiredModerations: 1,
    };

    // Act & Assert
    await expect(
      commentModerationRepository.createModerationComment(commentData),
    ).rejects.toThrowError();
  });

  it('should create a new child comment for a published comment of a published post', async () => {
    // Arrange
    const commentData = {
      content: 'Test Content',
      authorNickname: 'Test Hash',
      authorHash: 'Test Nickname',
      postId: 1,
      parentId: 1,
      requiredModerations: 1,
    };

    // Act
    const createdComment =
      await commentModerationRepository.createModerationComment(commentData);

    // Assert
    expect(createdComment.status).toEqual(PostStatus.PENDING);
    expect(createdComment.requiredModerations).toEqual(
      commentData.requiredModerations,
    );
    expect(createdComment.versions.length).toEqual(1);
    expect(createdComment.versions[0].content).toEqual(commentData.content);
    expect(createdComment.versions[0].authorHash).toEqual(
      commentData.authorHash,
    );
    expect(createdComment.versions[0].authorNickname).toEqual(
      commentData.authorNickname,
    );
  });

  it('should fail to create a new child comment if parent comment is not found in main db', async () => {
    // Arrange
    const commentData = {
      content: 'Test Content',
      authorNickname: 'Test Hash',
      authorHash: 'Test Nickname',
      postId: 1,
      parentId: 999,
      requiredModerations: 1,
    };

    // Act & Assert
    await expect(
      commentModerationRepository.createModerationComment(commentData),
    ).rejects.toThrowError();
  });

  it('should get comment version by id', async () => {
    // Act
    const version = await commentModerationRepository.getCommentVersionById(1);

    // Assert
    expect(version).toEqual(version1);
  });

  it('should return null for non existent comment version id', async () => {
    // Act
    const version = await commentModerationRepository.getCommentVersionById(
      999,
    );

    // Assert
    expect(version).toEqual(null);
  });

  it('should approve comment version', async () => {
    // Act
    const comment = await commentModerationRepository.approveCommentVersion(
      7,
      'testHash',
      'testNickname',
      'test reason',
    );

    // Assert
    expect(comment.versions[0].id).toEqual(7);
    expect(comment.versions[0].moderations[0].moderatorNickname).toEqual(
      'testNickname',
    );
    expect(comment.versions[0].moderations[0].moderatorHash).toEqual(
      'testHash',
    );
    expect(comment.versions[0].moderations[0].reason).toEqual('test reason');
  });

  it('should throw error when approving comment version that has already been moderated by the same moderator', async () => {
    // Act
    await commentModerationRepository.approveCommentVersion(
      7,
      'testHash',
      'testNickname',
      'test reason',
    );

    await expect(
      commentModerationRepository.approveCommentVersion(
        7,
        'testHash',
        'testNickname',
        'test reason',
      ),
    ).rejects.toThrowError();
  });

  it('should throw error when rejecting comment version that has already been moderated by the same moderator', async () => {
    // Act
    await commentModerationRepository.rejectCommentVersion(
      7,
      'testHash',
      'testNickname',
      'test reason',
    );

    await expect(
      commentModerationRepository.rejectCommentVersion(
        7,
        'testHash',
        'testNickname',
        'test reason',
      ),
    ).rejects.toThrowError();
  });

  it('should throw error when trying to approve outdated comment version', async () => {
    // Act & Assert
    await expect(
      commentModerationRepository.approveCommentVersion(
        6,
        'testHash',
        'testNickname',
        'test reason',
      ),
    ).rejects.toThrowError();
  });

  it('should throw error when accepting comment version of non pending comment', async () => {
    // Act
    await expect(
      commentModerationRepository.approveCommentVersion(
        4,
        'testHash',
        'testNickname',
        'test reason',
      ),
    ).rejects.toThrowError();
  });

  it('should reject comment version', async () => {
    // Act
    const comment = await commentModerationRepository.rejectCommentVersion(
      7,
      'testHash',
      'testNickname',
      'test reason',
    );

    // Assert
    expect(comment.versions[0].id).toEqual(7);
    expect(comment.versions[0].moderations[0].moderatorNickname).toEqual(
      'testNickname',
    );
    expect(comment.versions[0].moderations[0].moderatorHash).toEqual(
      'testHash',
    );
    expect(comment.versions[0].moderations[0].reason).toEqual('test reason');
  });

  it('should throw error when trying to reject outdated comment version', async () => {
    // Act & Assert
    await expect(
      commentModerationRepository.rejectCommentVersion(
        6,
        'testHash',
        'testNickname',
        'test reason',
      ),
    ).rejects.toThrowError();
  });

  it('should modify a moderated comment', async () => {
    // Act & Assert
    const comment = await commentModerationRepository.modifyModerationComment(
      7,
      'testHash',
      'testNickname',
      'test reason',
      {
        content: 'Test Content',
      },
    );

    expect(comment.versions[0].content).toEqual('Test Content');
    expect(comment.versions[0].latest).toEqual(true);
    expect(comment.versions[1].latest).toEqual(false);
    expect(comment.versions[0].moderations.length).toEqual(0);
  });

  it('should renew a moderated comment', async () => {
    // Act & Assert
    const acceptedComment =
      await commentModerationRepository.approveCommentVersion(
        7,
        'testHash',
        'testNickname',
        'test reason',
      );
    const acceptedCommentModerationId =
      acceptedComment.versions[0].moderations[0].id;

    const renewedAcceptedComment =
      await commentModerationRepository.renewCommentModeration(
        acceptedCommentModerationId,
        'testHash',
      );

    expect(renewedAcceptedComment.versions[0].moderations[0]).not.toEqual(
      acceptedCommentModerationId,
    );

    const rejectedComment =
      await commentModerationRepository.rejectCommentVersion(
        7,
        'testHash',
        'testNickname',
        'test reason',
      );
    const rejectedCommentModerationId =
      rejectedComment.versions[0].moderations[0].id;

    const renewedRejectedComment =
      await commentModerationRepository.renewCommentModeration(
        rejectedCommentModerationId,
        'testHash',
      );

    expect(renewedRejectedComment.versions[0].moderations[0]).not.toEqual(
      rejectedCommentModerationId,
    );
  });
});
