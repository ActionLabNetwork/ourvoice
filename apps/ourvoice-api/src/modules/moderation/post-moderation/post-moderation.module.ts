import { PostModule } from './../../post/post.module';
import { Module } from '@nestjs/common';
import { PrismaModule as MainPrismaModule } from 'src/database/main/prisma.module';
import { PrismaModule as PremoderationPrismaModule } from 'src/database/premoderation/prisma.module';
import { PostModerationRepository } from './post-moderation.repository';
import { PostModerationResolver } from './post-moderation.resolver';
import { PostModerationService } from './post-moderation.service';

@Module({
  imports: [MainPrismaModule, PremoderationPrismaModule, PostModule],
  providers: [
    PostModerationRepository,
    PostModerationService,
    PostModerationResolver,
  ],
  exports: [PostModerationService, PostModerationRepository],
})
export class PostModerationModule {}
