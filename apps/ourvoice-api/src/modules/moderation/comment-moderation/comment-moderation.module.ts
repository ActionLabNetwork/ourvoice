import { PrismaModule } from 'src/database/moderation/prisma.module';
import { Module } from '@nestjs/common';
import { CommentModerationResolver } from './ comment-moderation.resolver';
import { CommentModerationRepository } from './comment-moderation.repository';
import { CommentModerationService } from './comment-moderation.service';
import { CommentModule } from 'src/modules/comment/comment.module';

@Module({
  imports: [PrismaModule, CommentModule],
  providers: [
    CommentModerationRepository,
    CommentModerationService,
    CommentModerationResolver,
  ],
  exports: [CommentModerationService, CommentModerationRepository],
})
export class CommentModerationModule {}
