import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(data: Prisma.CommentCreateInput) {
    return this.prisma.comment.create({ data });
  }

  async getCommentById(id: number) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async getAllComments() {
    return this.prisma.comment.findMany();
  }

  async updateComment(id: number, data: Prisma.CommentUpdateInput) {
    return this.prisma.comment.update({ where: { id }, data });
  }

  async deleteComment(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
