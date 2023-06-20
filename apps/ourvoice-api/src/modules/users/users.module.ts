import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { RolesService } from './roles/roles.service';
import { MetadataService } from './metadata/metadata.service';

@Module({
  controllers: [UserController],
  providers: [UsersService, RolesService, MetadataService],
})
export class UsersModule {}
