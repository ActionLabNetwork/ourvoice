import { PrismaService } from '../../database/prisma.service';
import { CommentService } from './comment.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentRepository } from './comment.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Comment, User, Post } from '@prisma/client';

describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepositoryMock: DeepMocked<CommentRepository>;

  const dummyComment: any = {
    id: 1,
    content: 'Test Content',
    authorId: 1,
    createdAt: new Date(),
    disabledAt: null,
    moderatedAt: null,
    publishedAt: null,
    moderated: false,
    published: false,
    postId: 0,
    parentId: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CommentRepository,
          useValue: createMock<CommentRepository>(),
        },
        CommentService,
        PrismaService,
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    commentRepositoryMock = module.get(CommentRepository);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should create a comment', async () => {
    // Arrange
    const commentCreateInput = {
      content: 'Test content',
      authorId: 1,
      postId: 1,
    };

    commentRepositoryMock.createComment.mockResolvedValue(dummyComment);

    // Act
    const result = await commentService.createComment(commentCreateInput);

    // Assert
    expect(result).toEqual(dummyComment);

    const { authorId, postId, ...restData } = commentCreateInput;
    expect(commentRepositoryMock.createComment).toHaveBeenCalledWith({
      ...restData,
      author: { connect: { id: authorId } },
      post: postId ? { connect: { id: postId } } : undefined,
    });
  });

  it('should get comments by ID', async () => {
    // Arrange
    const commentId = 1;

    commentRepositoryMock.getCommentById.mockResolvedValue(dummyComment);

    // Act
    const result = await commentService.getCommentById(commentId);

    // Assert
    expect(result).toEqual(dummyComment);
    expect(commentRepositoryMock.getCommentById).toHaveBeenCalledWith(
      commentId,
    );
  });

  it('should update a comment', async () => {
    // Arrange
    const commentId = 1;
    const commentUpdateInput = {
      content: 'Updated Content',
    };

    const updatedComment = {
      ...dummyComment,
      content: commentUpdateInput.content,
    };

    commentRepositoryMock.updateComment.mockResolvedValue(updatedComment);

    // Act
    const result = await commentService.updateComment(
      commentId,
      commentUpdateInput,
    );

    // Assert
    expect(result).toEqual(updatedComment);
    expect(commentRepositoryMock.updateComment).toHaveBeenCalledWith(
      commentId,
      commentUpdateInput,
    );
  });

  it('should delete a comment', async () => {
    // Arrange
    const commentId = 1;

    commentRepositoryMock.deleteComment.mockResolvedValue(dummyComment);

    // Act
    const result = await commentService.deleteComment(commentId);

    // Assert
    expect(result).toEqual(dummyComment);
    expect(commentRepositoryMock.deleteComment).toHaveBeenCalledWith(commentId);
  });

  it('should return null for non-existent comment ID', async () => {
    // Arrange
    const commentId = 999;

    commentRepositoryMock.getCommentById.mockResolvedValue(null);

    // Act
    const result = await commentService.getCommentById(commentId);

    // Assert
    expect(result).toBeNull();
    expect(commentRepositoryMock.getCommentById).toHaveBeenCalledWith(
      commentId,
    );
  });
});
