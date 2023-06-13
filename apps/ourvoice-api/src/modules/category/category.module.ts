import { PrismaModule } from 'src/database/main/prisma.module';
import { Module } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';

@Module({
  imports: [PrismaModule],
  providers: [CategoryRepository, CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
