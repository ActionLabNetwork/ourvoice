import { PrismaModule } from 'src/database/premoderation/prisma.module';
import { Module } from '@nestjs/common';
import { CommentModerationResolver } from './ comment-moderation.resolver';
import { CommentModerationRepository } from './comment-moderation.repository';
import { CommentModerationService } from './comment-moderation.service';

@Module({
  imports: [PrismaModule],
  providers: [
    CommentModerationRepository,
    CommentModerationService,
    CommentModerationResolver,
  ],
  exports: [CommentModerationService],
})
export class CommentModerationModule {}
