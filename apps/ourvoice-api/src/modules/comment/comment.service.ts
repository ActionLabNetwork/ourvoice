import { CommentCreateInput, CommentUpdateInput } from './../../graphql';
import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(data: CommentCreateInput): Promise<Comment> {
    const { authorId, ...restData } = data;

    const commentData = {
      ...restData,
      author: { connect: { id: authorId } },
    };
    return this.commentRepository.createComment(commentData);
  }

  async getAllComments(): Promise<Comment[]> {
    return this.commentRepository.getAllComments();
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
