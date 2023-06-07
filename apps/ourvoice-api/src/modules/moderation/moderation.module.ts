import { PostModerationModule } from './post-moderation/post-moderation.module';
import { CommentModerationModule } from './comment-moderation/comment-moderation.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PostModerationModule, CommentModerationModule],
})
export class ModerationModule {}
