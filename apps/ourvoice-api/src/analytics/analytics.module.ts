import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/moderation/prisma.module';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsInterceptor } from './analytics.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TrackingController } from './tracking.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule],
  providers: [
    AnalyticsRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: AnalyticsInterceptor,
    },
  ],
  controllers: [TrackingController],
})
export class AnalyticsModule {}
