import { PostModule } from './../../post/post.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/premoderation/prisma.module';
import { PostModerationRepository } from './post-moderation.repository';
import { PostModerationResolver } from './post-moderation.resolver';
import { PostModerationService } from './post-moderation.service';

@Module({
  imports: [PrismaModule, PostModule],
  providers: [
    PostModerationRepository,
    PostModerationService,
    PostModerationResolver,
  ],
  exports: [PostModerationService, PostModerationRepository],
})
export class PostModerationModule {}
