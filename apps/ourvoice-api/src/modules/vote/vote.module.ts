import { VoteResolver } from './vote.resolver';
import { VoteService } from './vote.service';
import { VoteRepository } from './vote.repository';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/main/prisma.module';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [PrismaModule, AnalyticsModule],
  providers: [VoteRepository, VoteService, VoteResolver],
  exports: [VoteService],
})
export class VoteModule {}
