import { PostModerationModule } from './post-moderation/post-moderation.module';
import { CommentModerationModule } from './comment-moderation/comment-moderation.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/premoderation/prisma.module';

@Module({
  imports: [PostModerationModule],
})
export class ModerationModule {}
