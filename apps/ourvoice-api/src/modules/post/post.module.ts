import { PremoderationService } from './../moderation/premoderation.service';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { Module } from '@nestjs/common';
import { PrismaModule as MainPrismaModule } from 'src/database/main/prisma.module';
import { PrismaModule as PremoderationPrismaModule } from 'src/database/premoderation/prisma.module';
import { PremoderationRepository } from '../moderation/premoderation.repository';

@Module({
  imports: [MainPrismaModule, PremoderationPrismaModule],
  providers: [
    PostRepository,
    PostService,
    PostResolver,
    PremoderationService,
    PremoderationRepository,
  ],
  exports: [PostService],
})
export class PostModule {}
