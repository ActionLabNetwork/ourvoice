import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/main/prisma.module';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [PrismaModule, AnalyticsModule],
  providers: [CommentRepository, CommentService, CommentResolver],
  exports: [CommentService],
})
export class CommentModule {}
