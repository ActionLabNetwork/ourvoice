import { ScheduledModerationService } from './scheduled-moderation-service';
import { PostModerationModule } from './post-moderation/post-moderation.module';
import { CommentModerationModule } from './comment-moderation/comment-moderation.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PostModerationModule, CommentModerationModule],
  providers: [ScheduledModerationService],
})
export class ModerationModule {}
