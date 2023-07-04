import { numberToCursor } from '../../utils/cursor-pagination';
import { NotFoundException } from '@nestjs/common';
import { seedMainDb } from './../../../prisma/seed';
import { PrismaService } from '../../database/main/prisma.service';
import { Test } from '@nestjs/testing';
import { PostRepository } from './post.repository';
import { ConfigService } from '@nestjs/config';

describe('PostRepository', () => {
  let postRepository: PostRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    await seedMainDb();
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'database.premoderationUrl') {
                return (
                  process.env.DATABASE_PREMODERATION_URL ||
                  'postgresql://your_db_user:your_db_password@127.0.0.1:5435/ourvoice_db_pre?schema=ourvoice&sslmode=prefer'
                );
              } else if (key === 'database.premoderationTestUrl') {
                return (
                  process.env.DATABASE_PREMODERATION_TEST_URL ||
                  'postgresql://your_db_user:your_db_password@127.0.0.1:5437/ourvoice_db_pre_test'
                );
              } else if (key === 'database.mainTestUrl') {
                return (
                  process.env.DATABASE_MAIN_TEST_URL ||
                  'postgresql://your_db_user:your_db_password@127.0.0.1:5436/ourvoice_db_test'
                );
              } else if (key === 'database.mainUrl') {
                return (
                  process.env.DATABASE_MAIN_URL ||
                  'postgresql://your_db_user:your_db_password@127.0.0.1:5433/ourvoice_db?schema=ourvoice&sslmode=prefer'
                );
              }
              return null;
            }),
          },
        },
        PostRepository,
      ],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    postRepository = moduleRef.get(PostRepository);
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests are done
    await prismaService.$disconnect();
  });

  it('should create a new post', async () => {
    // Arrange
    jest.spyOn(prismaService.post, 'create');
    const categoriesId = [{ id: 1 }, { id: 2 }];
    const postData = {
      title: 'Test Title',
      content: 'Test Content',
      authorNickname: 'Test Hash',
      authorHash: 'Test Nickname',
      categories: { connect: categoriesId },
    };

    // Act
    const createdPost = await postRepository.createPost(postData);

    // Assert
    expect(createdPost.title).toEqual(postData.title);
    expect(createdPost.content).toEqual(postData.content);
    expect(createdPost.authorHash).toEqual(postData.authorHash);
    expect(createdPost.authorNickname).toEqual(postData.authorNickname);
    expect(prismaService.post.create).toHaveBeenCalledTimes(1);
  });

  it('should get a post by id', async () => {
    // Arrange
    jest.spyOn(prismaService.post, 'findUnique');
    const firstPost = {
      id: 1,
      title: 'Post 1',
      content: 'This is the content of post 1. This is version 3',
      files: ['https://example.com/file1.jpg'],
      moderated: true,
      published: true,
      votesUp: 5,
      votesDown: 1,
      authorHash: 'user1hash',
      authorNickname: 'user1hash',
      createdAt: new Date('2023-04-13T10:00:00Z'),
      disabledAt: null,
      moderatedAt: null,
      publishedAt: null,
      categories: [
        {
          id: 1,
          name: 'Work Environment',
          description: 'Discuss the work environment and facilities',
          active: true,
          createdAt: new Date('2023-04-13T10:00:00.000Z'),
          disabledAt: null,
          parentId: null,
          weight: 0,
        },
        {
          id: 2,
          name: 'Management',
          description: 'Share feedback about management and leadership',
          active: true,
          createdAt: new Date('2023-04-13T10:00:00.000Z'),
          disabledAt: null,
          parentId: null,
          weight: 0,
        },
      ],
    };

    // Act
    const post = await postRepository.getPostById(1, { categories: true });

    // Assert
    expect(post).toEqual(firstPost);
    expect(prismaService.post.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should fail to get non existent post', async () => {
    // Act
    const post = await postRepository.getPostById(999);

    // Assert
    expect(post).toBeNull();
  });

  it('should return all posts when no filter or pagination is provided', async () => {
    // Act
    jest.spyOn(prismaService.post, 'findMany');
    const posts = await postRepository.getPosts(null, null);

    // Assert
    expect(posts.posts.length).toEqual(3);
    expect(posts.totalCount).toEqual(3);
    expect(prismaService.post.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return posts according to the limit', async () => {
    // Act
    jest.spyOn(prismaService.post, 'findMany');
    const posts = await postRepository.getPosts(undefined, { limit: 2 });

    // Assert
    expect(posts.posts.map((post) => post.id)).toEqual([1, 2]);
    expect(posts.posts.length).toEqual(2);
    expect(posts.totalCount).toEqual(3);
    expect(prismaService.post.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return posts according to the cursor and limit', async () => {
    // Act
    jest.spyOn(prismaService.post, 'findMany');
    const posts = await postRepository.getPosts(undefined, {
      cursor: numberToCursor(1),
      limit: 1,
    });

    // Assert
    expect(posts.posts.map((post) => post.id)).toEqual([2]);
    expect(posts.posts.length).toEqual(1);
    expect(posts.totalCount).toEqual(3);
    expect(prismaService.post.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return posts according to the title filter', async () => {
    // Act
    jest.spyOn(prismaService.post, 'findMany');
    const posts = await postRepository.getPosts({ title: 'Post 2' });

    // Assert
    expect(posts.posts.length).toEqual(1);
    expect(posts.posts[0].title).toEqual('Post 2');
    expect(posts.posts[0].id).toEqual(2);
    expect(posts.totalCount).toEqual(1);
    expect(prismaService.post.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return posts according to the title and partial content match filters', async () => {
    // Act
    jest.spyOn(prismaService.post, 'findMany');
    const posts = await postRepository.getPosts({
      title: 'Post 2',
      content: 'content of post 2',
    });

    // Assert
    expect(posts.posts.length).toEqual(1);
    expect(posts.posts[0].title).toEqual('Post 2');
    expect(posts.posts[0].id).toEqual(2);
    expect(posts.totalCount).toEqual(1);
    expect(prismaService.post.findMany).toHaveBeenCalledTimes(1);
  });

  it('should not return post with a partial match of the filters', async () => {
    // Act
    jest.spyOn(prismaService.post, 'findMany');
    const posts = await postRepository.getPosts({
      title: 'Post 2',
      content: 'content of post 1',
    });

    // Assert
    expect(posts.posts.length).toEqual(0);
    expect(posts.totalCount).toEqual(0);
    expect(prismaService.post.findMany).toHaveBeenCalledTimes(1);
  });

  it('should get posts by category names', async () => {
    // Arrange
    jest.spyOn(prismaService.post, 'findMany');
    const categoryNames = ['Work Environment', 'Policies'];

    // Act
    const posts = await postRepository.getPostsByCategories(categoryNames);

    // Assert
    expect(posts.length).toEqual(3);
    expect(prismaService.post.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when category names are empty', async () => {
    // Arrange
    jest.spyOn(prismaService.post, 'findMany');

    // Act
    const posts = await postRepository.getPostsByCategories([]);

    // Assert
    expect(posts).toEqual([]);
    expect(posts.length).toEqual(0);
    expect(prismaService.post.findMany).toHaveBeenCalledTimes(1);
  });

  it('should delete an existing post', async () => {
    // Arrange
    jest.spyOn(prismaService.post, 'delete');

    // Act
    const deletedPost = await postRepository.deletePost(1);

    // Assert
    expect(deletedPost.id).toEqual(1);
    expect(prismaService.post.delete).toHaveBeenCalledTimes(1);
  });

  it('should fail to delete non existent post', async () => {
    // Arrange
    jest.spyOn(prismaService.post, 'delete');

    // Act & Assert
    await expect(postRepository.deletePost(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
