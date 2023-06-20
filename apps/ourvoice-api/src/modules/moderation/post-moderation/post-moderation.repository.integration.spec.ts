import {
  PostModeration,
  PostStatus,
  PostVersion,
  Decision,
} from '../../../../node_modules/@internal/prisma/client';
import { numberToCursor } from '../../../utils/cursor-pagination';
import { seedDb } from '../../../../prisma-premoderation/seed';
import { PrismaService } from '../../../database/premoderation/prisma.service';
import { Test } from '@nestjs/testing';
import { PostModule } from './../../post/post.module';
import { PostModerationRepository } from './post-moderation.repository';
import {
  PostBuilder,
  PostModerationBuilder,
  PostVersionBuilder,
} from './post-moderation.builder';
import { ModerationPostStatus } from '../../../graphql';

describe('PostRepository', () => {
  const TOTAL_POSTS = 10;
  const POSTS_PER_PAGE = 10;

  const moderation1 = new PostModerationBuilder()
    .withId(1)
    .withPostVersionId(1)
    .withModeratorHash('moderator1hash')
    .withModeratorNickname('spiritual_olive_salmon')
    .withDecision(Decision.ACCEPTED)
    .withReason('Moderation reason for post 1')
    .withTimestamp(new Date('2023-04-13T10:40:00.000Z'))
    .build() as PostModeration;

  const moderation2 = new PostModerationBuilder(moderation1)
    .withId(2)
    .withTimestamp(new Date('2023-04-14T10:40:00.000Z'))
    .build() as PostModeration;

  const moderation3 = new PostModerationBuilder(moderation2)
    .withId(3)
    .withTimestamp(new Date('2023-04-15T10:40:00.000Z'))
    .build() as PostModeration;

  const moderation4 = new PostModerationBuilder()
    .withId(4)
    .withPostVersionId(2)
    .withModeratorHash('moderator2hash')
    .withModeratorNickname('sympathetic_jade_landfowl')
    .withDecision(Decision.REJECTED)
    .withReason('Moderation reason for post 2')
    .withTimestamp(new Date('2023-04-14T10:40:00.000Z'))
    .build() as PostModeration;

  const moderation5 = new PostModerationBuilder(moderation4)
    .withId(5)
    .withTimestamp(new Date('2023-04-15T10:40:00.000Z'))
    .build() as PostModeration;

  const moderation6 = new PostModerationBuilder(moderation5)
    .withId(6)
    .withTimestamp(new Date('2023-04-16T10:40:00.000Z'))
    .build() as PostModeration;

  const moderation7 = new PostModerationBuilder()
    .withId(7)
    .withPostVersionId(3)
    .withModeratorHash('moderator3hash')
    .withModeratorNickname('charming_rose_hummingbird')
    .withDecision(Decision.ACCEPTED)
    .withReason('Moderation reason for post 3')
    .withTimestamp(new Date('2023-04-15T10:40:00.000Z'))
    .build() as PostModeration;

  const moderation8 = new PostModerationBuilder(moderation7)
    .withId(8)
    .withTimestamp(new Date('2023-04-16T10:40:00.000Z'))
    .build() as PostModeration;

  const moderation9 = new PostModerationBuilder(moderation8)
    .withId(9)
    .withTimestamp(new Date('2023-04-17T10:40:00.000Z'))
    .build() as PostModeration;

  const version1 = new PostVersionBuilder()
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
    .withModerations([moderation3, moderation2, moderation1])
    .build() as PostVersion & { moderations: PostModeration[] };

  const version2 = new PostVersionBuilder(version1)
    .withId(2)
    .withContent('This is the content of post 1. This is version 2')
    .withVersion(2)
    .withReason('Modified by moderator')
    .withTimestamp(new Date('2023-04-14T10:00:00.000Z'))
    .withModerations([moderation6, moderation5, moderation4])
    .build() as PostVersion & { moderations: PostModeration[] };

  const version3 = new PostVersionBuilder(version2)
    .withId(3)
    .withContent('This is the content of post 1. This is version 3')
    .withVersion(3)
    .withLatest(true)
    .withTimestamp(new Date('2023-04-15T10:00:00.000Z'))
    .withModerations([moderation9, moderation8, moderation7])
    .build() as PostVersion & { moderations: PostModeration[] };

  const firstPost = new PostBuilder()
    .withId(1)
    .withStatus(PostStatus.APPROVED)
    .withRequiredModerations(1)
    .withAuthorHash('user1hash')
    .withAuthorNickname('correct_teal_duck')
    .withPostIdInMainDb(1)
    .withVersions([version3, version2, version1])
    .build();

  let postModerationRepository: PostModerationRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    await seedDb();
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PostModule],
      providers: [PrismaService, PostModerationRepository],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    postModerationRepository = moduleRef.get(PostModerationRepository);
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests are done
    await prismaService.$disconnect();
  });

  it('should get a post by id', async () => {
    // Act
    const post = await postModerationRepository.getModerationPostById(1);

    // Assert
    expect(post).toEqual(firstPost);
  });

  it('should return null for non existent post id', async () => {
    // Act
    const post = await postModerationRepository.getModerationPostById(999);

    // Assert
    expect(post).toEqual(null);
  });

  it('should return pending moderation posts', async () => {
    // Act
    const posts = await postModerationRepository.getModerationPosts(
      { status: ModerationPostStatus.PENDING },
      null,
    );

    // Assert
    expect(posts.totalCount).toEqual(3);
    expect(posts.moderationPosts.length).toEqual(3);
  });

  it('should return approved moderation posts', async () => {
    // Act
    const posts = await postModerationRepository.getModerationPosts(
      { status: ModerationPostStatus.APPROVED },
      null,
    );

    // Assert
    expect(posts.totalCount).toEqual(4);
    expect(posts.moderationPosts.length).toEqual(4);
  });

  it('should return rejected moderation posts', async () => {
    // Act
    const posts = await postModerationRepository.getModerationPosts(
      { status: ModerationPostStatus.REJECTED },
      null,
    );

    // Assert
    expect(posts.totalCount).toEqual(3);
    expect(posts.moderationPosts.length).toEqual(3);
  });

  it('should return 10 posts as default when no limit is provided', async () => {
    // Act
    const posts = await postModerationRepository.getModerationPosts();

    // Assert
    expect(posts.totalCount).toEqual(TOTAL_POSTS);
    expect(posts.moderationPosts.length).toEqual(POSTS_PER_PAGE);
  });

  it('should return 5 posts when limit is 5', async () => {
    // Act
    const posts = await postModerationRepository.getModerationPosts(null, {
      limit: 5,
    });

    // Assert
    expect(posts.totalCount).toEqual(TOTAL_POSTS);
    expect(posts.moderationPosts.length).toEqual(5);
  });

  it('should succeed forward pagination', async () => {
    // Act
    const posts = await postModerationRepository.getModerationPosts(null, {
      limit: 5,
    });
    const nextPosts = await postModerationRepository.getModerationPosts(null, {
      after: numberToCursor(posts.moderationPosts.at(-1).id),
      limit: 5,
    });

    // Assert
    expect(posts.totalCount).toEqual(TOTAL_POSTS);
    expect(posts.moderationPosts.length).toEqual(5);
    expect(nextPosts.moderationPosts.length).toEqual(5);
    expect(nextPosts.moderationPosts[0].id).toEqual(6);
  });

  it('should return empty array due to invalid cursor (non-existent id)', async () => {
    // Act
    const posts = await postModerationRepository.getModerationPosts(null, {
      limit: 5,
    });
    const nextPosts = await postModerationRepository.getModerationPosts(null, {
      after: numberToCursor(999),
      limit: 5,
    });

    expect(posts.totalCount).toEqual(TOTAL_POSTS);
    expect(posts.moderationPosts.length).toEqual(5);
    expect(nextPosts.totalCount).toEqual(TOTAL_POSTS);
    expect(nextPosts.moderationPosts.length).toEqual(0);
  });

  it('should throw error due to invalid cursor (non-existent cursor)', async () => {
    // Act & Assert
    const posts = await postModerationRepository.getModerationPosts(null, {
      limit: 5,
    });

    expect(posts.totalCount).toEqual(TOTAL_POSTS);
    expect(posts.moderationPosts.length).toEqual(5);

    await expect(
      postModerationRepository.getModerationPosts(null, {
        after: 'asdadasdas',
        limit: 5,
      }),
    ).rejects.toThrowError();
  });

  it('should succeed backward pagination', async () => {
    // Act
    const posts = await postModerationRepository.getModerationPosts(null, {
      limit: 2,
    });
    const nextPosts = await postModerationRepository.getModerationPosts(null, {
      after: numberToCursor(posts.moderationPosts.at(-1).id),
      limit: 2,
    });
    const prevPosts = await postModerationRepository.getModerationPosts(null, {
      before: numberToCursor(nextPosts.moderationPosts[0].id),
      limit: 2,
    });

    // Assert
    expect(posts.totalCount).toEqual(TOTAL_POSTS);
    expect(posts.moderationPosts.length).toEqual(2);
    expect(nextPosts.moderationPosts.length).toEqual(2);
    expect(nextPosts.moderationPosts[0].id).toEqual(3);
    expect(prevPosts.moderationPosts.length).toEqual(2);
    expect(prevPosts.moderationPosts[0].id).toEqual(1);
  });

  it('should create a new post', async () => {
    // Arrange
    const postData = {
      title: 'Test Title',
      content: 'Test Content',
      authorNickname: 'Test Hash',
      authorHash: 'Test Nickname',
      categoryIds: [1, 2],
      requiredModerations: 1,
    };

    // Act
    const createdPost = await postModerationRepository.createModerationPost(
      postData,
    );

    // Assert
    expect(createdPost.status).toEqual(PostStatus.PENDING);
    expect(createdPost.requiredModerations).toEqual(
      postData.requiredModerations,
    );
    expect(createdPost.versions.length).toEqual(1);
    expect(createdPost.versions[0].title).toEqual(postData.title);
    expect(createdPost.versions[0].content).toEqual(postData.content);
    expect(createdPost.versions[0].categoryIds).toEqual(postData.categoryIds);
    expect(createdPost.versions[0].authorHash).toEqual(postData.authorHash);
    expect(createdPost.versions[0].authorNickname).toEqual(
      postData.authorNickname,
    );
  });

  it('should get post version by id', async () => {
    // Act
    const version = await postModerationRepository.getPostVersionById(1);

    // Assert
    expect(version).toEqual(version1);
  });

  it('should return null for non existent post version id', async () => {
    // Act
    const version = await postModerationRepository.getPostVersionById(999);

    // Assert
    expect(version).toEqual(null);
  });

  it('should approve post version', async () => {
    // Act
    const post = await postModerationRepository.approvePostVersion(
      6,
      'testHash',
      'testNickname',
      'test reason',
    );

    // Assert
    expect(post.versions[0].id).toEqual(6);
    expect(post.versions[0].moderations[0].moderatorNickname).toEqual(
      'testNickname',
    );
    expect(post.versions[0].moderations[0].moderatorHash).toEqual('testHash');
    expect(post.versions[0].moderations[0].reason).toEqual('test reason');
  });

  it('should throw error when approving post version that has already been moderated by the same moderator', async () => {
    // Act
    await postModerationRepository.approvePostVersion(
      6,
      'testHash',
      'testNickname',
      'test reason',
    );

    await expect(
      postModerationRepository.approvePostVersion(
        6,
        'testHash',
        'testNickname',
        'test reason',
      ),
    ).rejects.toThrowError();
  });

  it('should throw error when rejecting post version that has already been moderated by the same moderator', async () => {
    // Act
    await postModerationRepository.rejectPostVersion(
      6,
      'testHash',
      'testNickname',
      'test reason',
    );

    await expect(
      postModerationRepository.rejectPostVersion(
        6,
        'testHash',
        'testNickname',
        'test reason',
      ),
    ).rejects.toThrowError();
  });

  it('should throw error when trying to approve outdated post version', async () => {
    // Act & Assert
    await expect(
      postModerationRepository.approvePostVersion(
        5,
        'testHash',
        'testNickname',
        'test reason',
      ),
    ).rejects.toThrowError();
  });

  it('should throw error when accepting post version of non pending post', async () => {
    // Act
    await expect(
      postModerationRepository.approvePostVersion(
        3,
        'testHash',
        'testNickname',
        'test reason',
      ),
    ).rejects.toThrowError();
  });

  it('should reject post version', async () => {
    // Act
    const post = await postModerationRepository.rejectPostVersion(
      6,
      'testHash',
      'testNickname',
      'test reason',
    );

    // Assert
    expect(post.versions[0].id).toEqual(6);
    expect(post.versions[0].moderations[0].moderatorNickname).toEqual(
      'testNickname',
    );
    expect(post.versions[0].moderations[0].moderatorHash).toEqual('testHash');
    expect(post.versions[0].moderations[0].reason).toEqual('test reason');
  });

  it('should throw error when trying to reject outdated post version', async () => {
    // Act & Assert
    await expect(
      postModerationRepository.rejectPostVersion(
        5,
        'testHash',
        'testNickname',
        'test reason',
      ),
    ).rejects.toThrowError();
  });

  it('should modify a moderated post', async () => {
    // Act & Assert
    const post = await postModerationRepository.modifyModerationPost(
      6,
      'testHash',
      'testNickname',
      'test reason',
      {
        title: 'Test Title',
        content: 'Test Content',
        categoryIds: [1, 2],
      },
    );

    expect(post.versions[0].title).toEqual('Test Title');
    expect(post.versions[0].content).toEqual('Test Content');
    expect(post.versions[0].categoryIds).toEqual([1, 2]);
    expect(post.versions[0].latest).toEqual(true);
    expect(post.versions[1].latest).toEqual(false);
    expect(post.versions[0].moderations.length).toEqual(0);
  });

  it('should renew a moderated post', async () => {
    // Act & Assert
    const acceptedPost = await postModerationRepository.approvePostVersion(
      6,
      'testHash',
      'testNickname',
      'test reason',
    );
    const acceptedPostModerationId = acceptedPost.versions[0].moderations[0].id;

    const renewedAcceptedPost =
      await postModerationRepository.renewPostModeration(
        acceptedPostModerationId,
        'testHash',
      );

    expect(renewedAcceptedPost.versions[0].moderations[0]).not.toEqual(
      acceptedPostModerationId,
    );

    const rejectedPost = await postModerationRepository.rejectPostVersion(
      6,
      'testHash',
      'testNickname',
      'test reason',
    );
    const rejectedPostModerationId = rejectedPost.versions[0].moderations[0].id;

    const renewedRejectedPost =
      await postModerationRepository.renewPostModeration(
        rejectedPostModerationId,
        'testHash',
      );

    expect(renewedRejectedPost.versions[0].moderations[0]).not.toEqual(
      rejectedPostModerationId,
    );
  });
});
