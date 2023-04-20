import { PrismaService } from '../../database/prisma.service';
import { PostService } from './post.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PostRepository } from './post.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Post } from '@prisma/client';

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
    file: null,
    moderated: false,
    published: false,
    votesDown: 0,
    votesUp: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PostRepository, useValue: createMock<PostRepository>() },
        PostService,
        PrismaService,
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepositoryMock = module.get(PostRepository);
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

  it('should return null for non-existent post ID', async () => {
    // Arrange
    const nonExistentPostId = 999;

    postRepositoryMock.getPostById.mockResolvedValue(null);

    // Act
    const result = await postService.getPostById(nonExistentPostId);

    // Assert
    expect(result).toBeNull();
    expect(postRepositoryMock.getPostById).toHaveBeenCalledWith(
      nonExistentPostId,
    );
  });

  it('');
});
