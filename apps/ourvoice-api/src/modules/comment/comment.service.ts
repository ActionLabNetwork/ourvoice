import {
  CommentCreateInput,
  CommentsFilterInput,
  CommentUpdateInput,
  PaginationInput,
} from './../../graphql';
import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { CommentRepository } from './comment.repository';

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
    pagination: PaginationInput,
  ): Promise<Comment[]> {
    return this.commentRepository.getComments(filter, pagination);
  }

  async getCommentById(id: number): Promise<Comment> {
    return this.commentRepository.getCommentById(id);
  }

  async updateComment(id: number, data: CommentUpdateInput): Promise<Comment> {
    return this.commentRepository.updateComment(id, data);
  }

  async deleteComment(id: number): Promise<Comment> {
    return this.commentRepository.deleteComment(id);
  }
}
