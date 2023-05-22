import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/premoderation/prisma.module';
import { ModerationModule } from '../moderation.module';
import { PostModerationRepository } from './post-moderation.repository';
import { PostModerationResolver } from './post-moderation.resolver';
import { PostModerationService } from './post-moderation.service';

@Module({
  imports: [PrismaModule],
  providers: [
    PostModerationRepository,
    PostModerationService,
    PostModerationResolver,
  ],
  exports: [PostModerationService],
})
export class PostModerationModule {}
