import { CommentPaginationInput, CommentPageInfo } from './../../graphql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from '@internals/@prisma-main-db/client';
import { CommentRepository } from './comment.repository';
import { numberToCursor } from '../../utils/cursor-pagination';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CommentsFilterDto } from './dto/comment-filter.dto';
import { CommentUpdateDto } from './dto/comment-update.dto';
import { CommentCreateDto } from './dto/comment-create.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(data: CommentCreateDto): Promise<Comment> {
    // Validate data
    const commentCreateDto = plainToClass(CommentCreateDto, data);
    const errors = await validate(commentCreateDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const { postId, parentId, ...restData } = data;
    const commentData = {
      ...restData,
      post: postId ? { connect: { id: postId } } : undefined,
      parent: parentId ? { connect: { id: parentId } } : undefined,
    };
    return this.commentRepository.createComment(commentData);
  }

  async getComments(
    filter?: CommentsFilterDto,
    pagination?: CommentPaginationInput,
  ): Promise<{
    totalCount: number;
    edges: { node: Comment; cursor: string }[];
    pageInfo: CommentPageInfo;
  }> {
    // Validate filters
    if (filter) {
      const commentsFilterDto = plainToClass(CommentsFilterDto, filter);
      const errors = await validate(commentsFilterDto);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
    }

    // Handle pagination
    const { totalCount, comments } = await this.commentRepository.getComments(
      filter,
      pagination,
    );

    const edges = comments.map((comment) => ({
      node: comment,
      cursor: numberToCursor(comment.id),
    }));

    const pageInfo = {
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasNextPage: comments.length < totalCount,
    };

    return { totalCount, edges, pageInfo };
  }

  async getCommentById(id: number): Promise<Comment> {
    return this.commentRepository.getCommentById(id);
  }

  async updateComment(id: number, data: CommentUpdateDto): Promise<Comment> {
    // Validate filters
    const commentUpdateDto = plainToClass(CommentUpdateDto, data);
    const errors = await validate(commentUpdateDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    // Check if comment exists
    const existingComment = await this.commentRepository.getCommentById(id);
    if (!existingComment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return this.commentRepository.updateComment(id, data);
  }

  async deleteComment(id: number): Promise<Comment> {
    // Check if comment exists
    const existingComment = await this.commentRepository.getCommentById(id);
    if (!existingComment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return this.commentRepository.deleteComment(id);
  }
}
