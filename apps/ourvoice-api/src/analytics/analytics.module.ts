import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/moderation/prisma.module';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsInterceptor } from './analytics.interceptor';

@Module({
  imports: [PrismaModule],
  providers: [AnalyticsRepository, AnalyticsInterceptor],
  exports: [AnalyticsRepository, AnalyticsInterceptor],
})
export class AnalyticsModule {}
