import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/moderation/prisma.module';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsInterceptor } from './analytics.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  providers: [
    AnalyticsRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: AnalyticsInterceptor,
    },
  ],
})
export class AnalyticsModule {}
