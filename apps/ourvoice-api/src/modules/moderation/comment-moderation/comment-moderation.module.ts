import { Module } from '@nestjs/common';
import { ModerationModule } from '../moderation.module';

@Module({
  imports: [ModerationModule],
})
export class CommentModerationModule {}
