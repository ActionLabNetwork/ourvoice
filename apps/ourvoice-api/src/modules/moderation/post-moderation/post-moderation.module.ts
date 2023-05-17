import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/premoderation/prisma.module';
import { ModerationModule } from '../moderation.module';
import { ModerationPostRepository } from './post-moderation.repository';
import { ModerationPostResolver } from './post-moderation.resolver';
import { ModerationPostService } from './post-moderation.service';

@Module({
  imports: [PrismaModule],
  providers: [
    ModerationPostRepository,
    ModerationPostService,
    ModerationPostResolver,
  ],
  exports: [ModerationPostService],
})
export class PostModerationModule {}
