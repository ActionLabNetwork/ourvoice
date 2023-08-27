import { PrismaService } from '../../database/main/prisma.service';
import { PostService } from './post.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PostRepository } from './post.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostCreateDto } from './dto/post-create.dto';

describe('PostService', () => {
  let postService: PostService;
  let postRepositoryMock: DeepMocked<PostRepository>;

  const dummyPost = {
    id: 1,
    title: 'Test Title',
    content: 'Test Content',
    authorNickname: 'Test Nickname',
    authorHash: 'Test Hash',
    createdAt: new Date('2023-05-03T00:04:54.956Z'),
    disabledAt: null,
    moderatedAt: null,
    publishedAt: null,
    files: null,
    moderated: false,
    published: false,
    votesDown: 0,
    votesUp: 0,
    comments: undefined,
    votes: undefined,
    categories: undefined,
    hasContentWarning: false,
    hasFromTheModeratorsTag: false,
  };

  const dummyCategories = [
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
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PostRepository, useValue: createMock<PostRepository>() },
        { provide: PrismaService, useValue: createMock<PrismaService>() },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepositoryMock = module.get(PostRepository);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should create a post', async () => {
    // Arrange
    const postCreateInput = {
      title: 'Test title',
      content: 'Test content',
      authorHash: 'Test hash',
      authorNickname: 'Test nickname',
      categoryIds: [1, 2],
      hasContentWarning: false,
      hasFromTheModeratorsTag: false,
    };

    postRepositoryMock.createPost.mockResolvedValue(dummyPost);

    // Act
    const result = await postService.createPost(postCreateInput);

    // Assert
    expect(result).toEqual(dummyPost);

    const { categoryIds: categories, ...restData } = postCreateInput;
    expect(postRepositoryMock.createPost).toHaveBeenCalledWith({
      ...restData,
      categories: {
        connect: categories.map((id) => ({ id })),
      },
    });
  });

  it('should fail to create post without title and content', async () => {
    // Arrange
    const postData: PostCreateDto = {
      title: '',
      content: '',
      authorHash: 'Test Hash',
      authorNickname: 'Test Nickname',
      categoryIds: [1],
      hasContentWarning: false,
      hasFromTheModeratorsTag: false,
    };

    // Act & Assert
    await expect(postService.createPost(postData)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should fail create post without authorHash and authorNickname', async () => {
    // Arrange
    const postData: PostCreateDto = {
      title: 'Test Title',
      content: 'Test Content',
      authorHash: null,
      authorNickname: null,
      categoryIds: [1],
      hasContentWarning: false,
      hasFromTheModeratorsTag: false,
    };

    // Act & Assert
    await expect(postService.createPost(postData)).rejects.toThrow(
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
      hasContentWarning: false,
      hasFromTheModeratorsTag: false,
    };

    const validPostData: PostCreateDto = {
      title: 'Test Title',
      content: 'Test Content',
      authorHash: 'Test Hash',
      authorNickname: 'Test Nickname',
      categoryIds: [1],
      hasContentWarning: false,
      hasFromTheModeratorsTag: false,
    };

    const tooManyCategoriesData: PostCreateDto = {
      title: 'Test Title',
      content: 'Test Content',
      authorHash: 'Test Hash',
      authorNickname: 'Test Nickname',
      categoryIds: [1, 2, 3],
      hasContentWarning: false,
      hasFromTheModeratorsTag: false,
    };

    // Act & Assert
    await expect(postService.createPost(noCategoryData)).rejects.toThrow(
      BadRequestException,
    );
    await expect(postService.createPost(validPostData)).resolves.not.toThrow();
    await expect(postService.createPost(tooManyCategoriesData)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should get a post by ID', async () => {
    // Arrange
    const postId = 1;
    postRepositoryMock.getPostById.mockResolvedValue({
      ...dummyPost,
      categories: dummyCategories,
    });

    // Act
    const result = await postService.getPostById(postId);

    // Assert
    expect(result).toEqual({ ...dummyPost, categories: dummyCategories });
    expect(postRepositoryMock.getPostById).toHaveBeenCalledWith(postId);
  });

  it('should return null when calling getPostById with an invalid id', async () => {
    // Arrange
    const postId = 999;
    postRepositoryMock.getPostById.mockResolvedValue(null);

    // Act
    const result = await postService.getPostById(postId);

    // Assert
    expect(result).toBeNull();
    expect(postRepositoryMock.getPostById).toHaveBeenCalledWith(postId);
  });

  // Tests that getPosts method successfully retrieves posts with valid filter and pagination input.
  it('should get posts with filters and pagination', async () => {
    // Arrange
    postRepositoryMock.getPosts.mockResolvedValue({
      totalCount: 1,
      posts: [dummyPost],
    });

    const filterData = { title: 'Test Title', moderated: true };
    const paginationData = { cursor: '1', limit: 10 };
    //TODO: Add test for sortData
    const sortData = undefined;
    const expectedResult = {
      edges: [
        {
          cursor: 'MQ==',
          node: {
            authorHash: 'Test Hash',
            authorNickname: 'Test Nickname',
            content: 'Test Content',
            createdAt: new Date('2023-05-03T00:04:54.956Z'),
            disabledAt: null,
            files: null,
            id: 1,
            moderated: false,
            moderatedAt: null,
            published: false,
            publishedAt: null,
            title: 'Test Title',
            votesDown: 0,
            votesUp: 0,
            votes: undefined,
            categories: undefined,
            comments: undefined,
            hasContentWarning: false,
            hasFromTheModeratorsTag: false,
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
    const result = await postService.getPosts(
      filterData,
      paginationData,
      sortData,
    );

    // Assert
    expect(result).toEqual(expectedResult);
    expect(postRepositoryMock.getPosts).toHaveBeenCalledWith(
      filterData,
      paginationData,
      sortData,
    );
  });

  it('should fail to get posts with invalid filters', async () => {
    const invalidFilterData = { title: 123, moderated: 'not boolean' };
    const paginationData = { cursor: '1', limit: 10 };

    await expect(
      postService.getPosts(invalidFilterData as unknown, paginationData),
    ).rejects.toThrow(BadRequestException);
  });

  it('should get posts by categories', async () => {
    // Arrange
    const categoryNames = ['Category 1', 'Category 2'];

    const posts = [
      { ...dummyPost, id: 1 },
      { ...dummyPost, id: 2 },
    ];

    postRepositoryMock.getPostsByCategories.mockResolvedValue(posts);

    // Act
    const result = await postService.getPostsByCategories(categoryNames);

    // Assert
    expect(result).toEqual(posts);
    expect(postRepositoryMock.getPostsByCategories).toHaveBeenCalledWith(
      categoryNames,
      undefined,
      undefined,
    );
  });

  it('should return no posts when categories is empty', async () => {
    // Arrange
    const categoryNames = [];
    const posts = [];

    postRepositoryMock.getPostsByCategories.mockResolvedValue(posts);

    // Act
    const result = await postService.getPostsByCategories(categoryNames);

    // Assert
    expect(result).toEqual(posts);
    expect(postRepositoryMock.getPostsByCategories).toHaveBeenCalledWith(
      categoryNames,
      undefined,
      undefined,
    );
  });

  it('should return no posts when categories is empty', async () => {
    // Arrange
    const categoryNames = [];
    // const skip = 0;
    // const take = 10;

    const posts = [];

    postRepositoryMock.getPostsByCategories.mockResolvedValue(posts);

    // Act
    const result = await postService.getPostsByCategories(categoryNames);

    // Assert
    expect(result).toEqual(posts);
    expect(postRepositoryMock.getPostsByCategories).toHaveBeenCalledWith(
      categoryNames,
      undefined,
      undefined,
    );
  });

  it('should return no posts when categories is empty', async () => {
    // Arrange
    const categoryNames = [];
    const posts = [];

    postRepositoryMock.getPostsByCategories.mockResolvedValue(posts);

    // Act
    const result = await postService.getPostsByCategories(categoryNames);

    // Assert
    expect(result).toEqual(posts);
    expect(postRepositoryMock.getPostsByCategories).toHaveBeenCalledWith(
      categoryNames,
      undefined,
      undefined,
    );
  });

  // it('should update a post', async () => {
  //   // Arrange
  //   const postId = 1;
  //   const postUpdateInput = {
  //     title: 'Updated Title',
  //     content: 'Updated Content',
  //   };

  //   const updatedPost = {
  //     ...dummyPost,
  //     id: postId,
  //     title: 'Updated Title',
  //     content: 'Updated Content',
  //     categories: dummyCategories,
  //   };

  //   postRepositoryMock.updatePost.mockResolvedValue(updatedPost);

  //   // Act
  //   const result = await postService.updatePost(postId, postUpdateInput);

  //   // Assert
  //   expect(result).toEqual(updatedPost);
  //   expect(postRepositoryMock.updatePost).toHaveBeenCalledWith(
  //     postId,
  //     postUpdateInput,
  //   );
  // });

  // it('should fail update post with invalid data', async () => {
  //   const postId = 1;
  //   const invalidPostUpdateInput = {
  //     title: '',
  //     content: '',
  //   };

  //   await expect(
  //     postService.updatePost(postId, invalidPostUpdateInput),
  //   ).rejects.toThrow(BadRequestException);
  // });

  // it('should fail to update a non-existent post', async () => {
  //   const nonExistentPostId = 999;
  //   const postUpdateInput = {
  //     title: 'Updated Title',
  //     content: 'Updated Content',
  //   };

  //   postRepositoryMock.getPostById.mockResolvedValue(null);

  //   await expect(
  //     postService.updatePost(nonExistentPostId, postUpdateInput),
  //   ).rejects.toThrow(NotFoundException);
  // });

  it('should delete a post', async () => {
    // Arrange
    const postId = 1;

    postRepositoryMock.deletePost.mockResolvedValue({
      ...dummyPost,
      categories: dummyCategories,
    });

    // Act
    const result = await postService.deletePost(postId);

    // Assert
    expect(result).toEqual({
      ...dummyPost,
      categories: dummyCategories,
    });
    expect(postRepositoryMock.deletePost).toHaveBeenCalledWith(postId);
  });

  it('should fail to delete a non-existent post', async () => {
    const nonExistentPostId = 999;

    postRepositoryMock.getPostById.mockResolvedValue(null);

    await expect(postService.deletePost(nonExistentPostId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
