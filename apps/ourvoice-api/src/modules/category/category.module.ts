import { PrismaModule } from 'src/database/main/prisma.module';
import { Module } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [PrismaModule, AnalyticsModule],
  providers: [CategoryRepository, CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
