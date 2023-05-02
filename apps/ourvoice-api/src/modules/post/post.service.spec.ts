import { PostCreateDto } from './dto/post-create.dto';
import { PrismaService } from '../../database/prisma.service';
import { PostService } from './post.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PostRepository } from './post.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Post } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PostService', () => {
  let postService: PostService;
  let postRepositoryMock: DeepMocked<PostRepository>;

  const dummyPost: Post = {
    id: 1,
    title: 'Test Title',
    content: 'Test Content',
    authorId: 1,
    createdAt: new Date(),
    disabledAt: null,
    moderatedAt: null,
    publishedAt: null,
    files: null,
    moderated: false,
    published: false,
    votesDown: 0,
    votesUp: 0,
  };

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
      authorId: 1,
      categoryIds: [1, 2],
    };

    postRepositoryMock.createPost.mockResolvedValue(dummyPost);

    // Act
    const result = await postService.createPost(postCreateInput);

    // Assert
    expect(result).toEqual(dummyPost);

    const { authorId, categoryIds: categories, ...restData } = postCreateInput;
    expect(postRepositoryMock.createPost).toHaveBeenCalledWith({
      ...restData,
      author: { connect: { id: authorId } },
      categories: {
        connect: categories.map((id) => ({ id })),
      },
    });
  });

  it('should fail create post without title and content', async () => {
    // Arrange
    const postData: PostCreateDto = {
      title: '',
      content: '',
      authorId: 1,
      categoryIds: [1],
    };

    // Act & Assert
    await expect(postService.createPost(postData)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should fail create post without authorId', async () => {
    // Arrange
    const postData: PostCreateDto = {
      title: 'Test Title',
      content: 'Test Content',
      authorId: null,
      categoryIds: [1],
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
      authorId: 1,
      categoryIds: [],
    };

    const validPostData: PostCreateDto = {
      title: 'Test Title',
      content: 'Test Content',
      authorId: 1,
      categoryIds: [1],
    };

    const tooManyCategoriesData: PostCreateDto = {
      title: 'Test Title',
      content: 'Test Content',
      authorId: 1,
      categoryIds: [1, 2, 3],
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
    postRepositoryMock.getPostById.mockResolvedValue(dummyPost);

    // Act
    const result = await postService.getPostById(postId);

    // Assert
    expect(result).toEqual(dummyPost);
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
    postRepositoryMock.getPosts.mockResolvedValue([dummyPost]);

    const filterData = { title: 'Test Title', moderated: true };
    const paginationData = { cursor: 1, limit: 10 };

    // Act
    const result = await postService.getPosts(filterData, paginationData);

    // Assert
    expect(result).toEqual([dummyPost]);
    expect(postRepositoryMock.getPosts).toHaveBeenCalledWith(
      filterData,
      paginationData,
    );
  });

  it('should fail to get posts with invalid filters', async () => {
    const invalidFilterData = { title: 123, moderated: 'not boolean' };
    const paginationData = { cursor: 1, limit: 10 };

    await expect(
      postService.getPosts(invalidFilterData as unknown, paginationData),
    ).rejects.toThrow(BadRequestException);
  });

  it('should get posts by categories', async () => {
    // Arrange
    const categoryNames = ['Category 1', 'Category 2'];
    const skip = 0;
    const take = 10;

    const posts = [
      { ...dummyPost, id: 1 },
      { ...dummyPost, id: 2 },
    ];

    postRepositoryMock.getPostsByCategories.mockResolvedValue(posts);

    // Act
    const result = await postService.getPostsByCategories(
      categoryNames,
      skip,
      take,
    );

    // Assert
    expect(result).toEqual(posts);
    expect(postRepositoryMock.getPostsByCategories).toHaveBeenCalledWith(
      categoryNames,
      skip,
      take,
    );
  });

  it('should return no posts when categories is empty', async () => {
    // Arrange
    const categoryNames = [];
    const skip = 0;
    const take = 10;

    const posts = [];

    postRepositoryMock.getPostsByCategories.mockResolvedValue(posts);

    // Act
    const result = await postService.getPostsByCategories(
      categoryNames,
      skip,
      take,
    );

    // Assert
    expect(result).toEqual(posts);
    expect(postRepositoryMock.getPostsByCategories).toHaveBeenCalledWith(
      categoryNames,
      skip,
      take,
    );
  });

  it('should update a post', async () => {
    // Arrange
    const postId = 1;
    const postUpdateInput = {
      title: 'Updated Title',
      content: 'Updated Content',
    };

    const updatedPost = {
      ...dummyPost,
      id: postId,
      title: 'Updated Title',
      content: 'Updated Content',
    };

    postRepositoryMock.updatePost.mockResolvedValue(updatedPost);

    // Act
    const result = await postService.updatePost(postId, postUpdateInput);

    // Assert
    expect(result).toEqual(updatedPost);
    expect(postRepositoryMock.updatePost).toHaveBeenCalledWith(
      postId,
      postUpdateInput,
    );
  });

  it('should fail update post with invalid data', async () => {
    const postId = 1;
    const invalidPostUpdateInput = {
      title: '',
      content: '',
    };

    await expect(
      postService.updatePost(postId, invalidPostUpdateInput),
    ).rejects.toThrow(BadRequestException);
  });

  it('should fail to update a non-existent post', async () => {
    const nonExistentPostId = 999;
    const postUpdateInput = {
      title: 'Updated Title',
      content: 'Updated Content',
    };

    postRepositoryMock.getPostById.mockResolvedValue(null);

    await expect(
      postService.updatePost(nonExistentPostId, postUpdateInput),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a post', async () => {
    // Arrange
    const postId = 1;

    postRepositoryMock.deletePost.mockResolvedValue(dummyPost);

    // Act
    const result = await postService.deletePost(postId);

    // Assert
    expect(result).toEqual(dummyPost);
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
