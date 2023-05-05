import {
  CommentCreateInput,
  CommentsFilterInput,
  CommentUpdateInput,
  CommentPaginationInput,
  CommentPageInfo,
} from './../../graphql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { CommentRepository } from './comment.repository';
import { numberToCursor } from '../../utils/cursor-pagination';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(data: CommentCreateInput): Promise<Comment> {
    const { authorId, postId, parentId, ...restData } = data;
    const commentData = {
      ...restData,
      author: { connect: { id: authorId } },
      post: postId ? { connect: { id: postId } } : undefined,
      parent: parentId ? { connect: { id: parentId } } : undefined,
    };
    return this.commentRepository.createComment(commentData);
  }

  async getComments(
    filter: CommentsFilterInput,
    pagination: CommentPaginationInput,
  ): Promise<{
    totalCount: number;
    edges: { node: Comment; cursor: string }[];
    pageInfo: CommentPageInfo;
  }> {
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

  async updateComment(id: number, data: CommentUpdateInput): Promise<Comment> {
    const existingComment = await this.commentRepository.getCommentById(id);
    if (!existingComment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return this.commentRepository.updateComment(id, data);
  }

  async deleteComment(id: number): Promise<Comment> {
    const existingComment = await this.commentRepository.getCommentById(id);
    if (!existingComment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return this.commentRepository.deleteComment(id);
  }
}
