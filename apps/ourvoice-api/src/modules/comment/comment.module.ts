import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/main/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CommentRepository, CommentService, CommentResolver],
  exports: [CommentService],
})
export class CommentModule {}
