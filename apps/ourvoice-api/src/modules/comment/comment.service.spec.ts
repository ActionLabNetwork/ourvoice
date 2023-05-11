import { PrismaService } from '../../database/prisma.service';
import { CommentService } from './comment.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentRepository } from './comment.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentUpdateDto } from './dto/comment-update.dto';
import { CommentsFilterDto } from './dto/comment-filter.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommentPaginationInput } from 'src/graphql';

describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepositoryMock: DeepMocked<CommentRepository>;

  const dummyComment: any = {
    id: 1,
    content: 'Test Content',
    authorId: 1,
    createdAt: new Date('2023-05-09T04:42:03.447Z'),
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
        { provide: PrismaService, useValue: createMock<PrismaService>() },
        CommentService,
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

  it('should faill to create a comment without authorId', async () => {
    // Arrange
    const commentData: CommentCreateDto = {
      content: 'Test content',
      postId: 1,
      authorId: null,
    };

    //Act & Assert
    await expect(commentService.createComment(commentData)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should faill to create a comment without content', async () => {
    // Arrange
    const commentData: CommentCreateDto = {
      content: null,
      postId: 1,
      authorId: 1,
    };

    //Act & Assert
    await expect(commentService.createComment(commentData)).rejects.toThrow(
      BadRequestException,
    );
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

  it('should return comments with filters and pagination', async () => {
    // Arrange
    commentRepositoryMock.getComments.mockResolvedValue({
      comments: [dummyComment],
      totalCount: 1,
    });
    const filters: CommentsFilterDto = {
      postId: 1,
      authorId: 1,
    };
    const pagination: CommentPaginationInput = {
      cursor: '1',
      limit: 1,
    };
    const expectedResult = {
      totalCount: 1,
      edges: [
        {
          node: {
            authorId: 1,
            content: 'Test Content',
            createdAt: new Date('2023-05-09T04:42:03.447Z'),
            disabledAt: null,
            id: 1,
            moderated: false,
            moderatedAt: null,
            parentId: 0,
            postId: 0,
            published: false,
            publishedAt: null,
          },
          cursor: 'MQ==',
        },
      ],
      pageInfo: { startCursor: 'MQ==', endCursor: 'MQ==', hasNextPage: false },
    };

    //Act
    const result = await commentService.getComments(filters, pagination);

    // Assert
    expect(result).toEqual(expectedResult);
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

  it('should faill to update a comment without content', async () => {
    // Arrange
    const commentId = 1;
    const invalidCommentUpdateInput: CommentUpdateDto = {
      content: '',
    };

    //Act & Assert
    await expect(
      commentService.updateComment(commentId, invalidCommentUpdateInput),
    ).rejects.toThrow(BadRequestException);
  });

  it('should faill to update a comment with invalid comment ID', async () => {
    // Arrange
    const nonExistentCommentId = 99;
    const commentUpdateInput: CommentUpdateDto = {
      content: 'Updated Content',
    };

    commentRepositoryMock.getCommentById.mockResolvedValue(null);

    //Act & Assert
    await expect(
      commentService.updateComment(nonExistentCommentId, commentUpdateInput),
    ).rejects.toThrow(NotFoundException);
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

  it('should faill to delete a comment with invalid comment ID', async () => {
    // Arrange
    const nonExistentCommentId = 99;

    commentRepositoryMock.getCommentById.mockResolvedValue(null);

    //Act & Assert
    await expect(
      commentService.deleteComment(nonExistentCommentId),
    ).rejects.toThrow(NotFoundException);
  });
});
