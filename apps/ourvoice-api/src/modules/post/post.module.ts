import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { Module } from '@nestjs/common';
import { PrismaModule as MainPrismaModule } from '../../database/main/prisma.module';
import { PrismaModule as ModerationPrismaModule } from '../../database/moderation/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [
    MainPrismaModule,
    ModerationPrismaModule,
    ConfigModule,
    AnalyticsModule,
  ],
  providers: [PostRepository, PostService, PostResolver],
  exports: [PostService],
})
export class PostModule {}
