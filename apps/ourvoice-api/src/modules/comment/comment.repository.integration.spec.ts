import { numberToCursor } from '../../utils/cursor-pagination';
import { NotFoundException } from '@nestjs/common';
import { seedMainDb } from './../../../prisma/seed';
import { PrismaService } from '../../database/main/prisma.service';
import { Test } from '@nestjs/testing';
import { CommentRepository } from './comment.repository';
import { ConfigService } from '@nestjs/config';

describe('CommentRepository', () => {
  let commentRepository: CommentRepository;
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
              if (key === 'database.mainTestUrl') {
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
        CommentRepository,
      ],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    commentRepository = moduleRef.get(CommentRepository);
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests are done
    await prismaService.$disconnect();
  });

  it('should create a new comment', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'create');
    const postId = { id: 1 };
    const parentId = { id: 1 };
    const commentData = {
      content: 'Test Content',
      authorHash: 'Test Hash',
      authorNickname: 'Test Nickname',
      post: { connect: postId },
      parent: { connect: parentId },
    };

    // Act
    const createdComment = await commentRepository.createComment(commentData);

    // Assert
    expect(createdComment.content).toEqual(commentData.content);
    expect(createdComment.authorHash).toEqual(commentData.authorHash);
    expect(createdComment.authorNickname).toEqual(commentData.authorNickname);
    expect(createdComment.postId).toEqual(postId.id);
    expect(createdComment.parentId).toEqual(parentId.id);
    expect(prismaService.comment.create).toHaveBeenCalledTimes(1);
  });

  it('should get a comment by id', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'findUnique');
    const firstComment = {
      id: 3,
      content: 'This is a reply to comment 1',
      moderated: false,
      published: false,
      createdAt: new Date('2023-04-14T10:30:00.000Z'),
      moderatedAt: null,
      publishedAt: null,
      disabledAt: null,
      authorHash: 'user1hash',
      authorNickname: 'user1',
      postId: 1,
      parentId: 1,
    };

    // Act
    const comment = await commentRepository.getCommentById(3);

    // Assert
    expect(comment).toEqual(firstComment);
    expect(prismaService.comment.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should fail to get non existent comment', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'findUnique');

    // Act
    const comment = await commentRepository.getCommentById(999);

    // Assert
    expect(comment).toBeNull();
    expect(prismaService.comment.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should get all comments', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'findMany');

    // Act
    const comments = await commentRepository.getComments(null, null);

    // Assert
    expect(comments.comments.length).toEqual(3);
    expect(comments.totalCount).toEqual(3);
    expect(prismaService.comment.findMany).toHaveBeenCalledTimes(1);
  });

  it('should get comments with pagination', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'findMany');

    // Act
    const comments = await commentRepository.getComments(undefined, {
      limit: 2,
    });

    // Assert
    expect(comments.comments.map((comment) => comment.id)).toEqual([1, 2]);
    expect(comments.totalCount).toEqual(3);
    expect(prismaService.comment.findMany).toHaveBeenCalledTimes(1);
  });

  it('should get comments with pagination and after cursor', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'findMany');

    // Act
    const comments = await commentRepository.getComments(undefined, {
      limit: 2,
      cursor: numberToCursor(1),
    });

    // Assert
    expect(comments.comments.map((comment) => comment.id)).toEqual([2, 3]);
    expect(comments.totalCount).toEqual(3);
    expect(prismaService.comment.findMany).toHaveBeenCalledTimes(1);
  });

  it('should get comments according to content filter', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'findMany');

    // Act
    const comments = await commentRepository.getComments({ content: 'reply' });

    // Assert
    expect(comments.comments.length).toEqual(1);
    expect(comments.comments[0].id).toEqual(3);
    expect(comments.comments[0].content).toEqual(
      'This is a reply to comment 1',
    );
    expect(comments.totalCount).toEqual(1);
    expect(prismaService.comment.findMany).toHaveBeenCalledTimes(1);
  });

  it('should get comments according to author filter', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'findMany');

    // Act
    const comments = await commentRepository.getComments({
      authorHash: 'user1hash',
      authorNickname: 'user1',
    });

    // Assert
    expect(comments.comments.length).toEqual(2);
    expect(comments.comments.map((comment) => comment.id)).toEqual([1, 3]);
    expect(comments.totalCount).toEqual(2);
    expect(prismaService.comment.findMany).toHaveBeenCalledTimes(1);
  });

  it('should update an existing comment', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'update');
    const commentData = {
      id: 1,
      content: 'Updated Content',
    };

    // Act
    const updatedComment = await commentRepository.updateComment(
      commentData.id,
      commentData,
    );

    // Assert
    expect(updatedComment.content).toEqual(commentData.content);
    expect(prismaService.comment.update).toHaveBeenCalledTimes(1);
  });

  it('should fail to update non existent comment', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'update');
    const commentData = {
      id: 999,
      content: 'Updated Content',
    };

    // Act & Assert
    await expect(
      commentRepository.updateComment(commentData.id, commentData),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete an existing comment', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'delete');

    // Act
    await commentRepository.deleteComment(1);

    // Assert
    expect(prismaService.comment.delete).toHaveBeenCalledTimes(1);
  });

  it('should fail to delete non existent comment', async () => {
    // Arrange
    jest.spyOn(prismaService.comment, 'delete');

    // Act & Assert
    await expect(commentRepository.deleteComment(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
