import { PrismaModule as MainPrismaModule } from '../../database/main/prisma.module';
import { PrismaModule as PremoderationPrismaModule } from '../../database/moderation/prisma.module';
import { PollRepository } from './poll.repository';
import { PollService } from './poll.service';
import { PollResolver } from './poll.resolver';
import { Module } from '@nestjs/common';
import { PollModerationRepository } from './poll-moderation.repository';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [MainPrismaModule, PremoderationPrismaModule, AnalyticsModule],
  providers: [
    PollRepository,
    PollModerationRepository,
    PollService,
    PollResolver,
  ],
})
export class PollModule {}
