import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { RolesService } from './roles/roles.service';
import { MetadataService } from './metadata/metadata.service';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [AnalyticsModule],
  controllers: [UserController],
  providers: [UsersService, RolesService, MetadataService],
})
export class UsersModule {}
