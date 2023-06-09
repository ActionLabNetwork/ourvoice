import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  SessionContainer,
  SessionClaimValidator,
} from 'supertokens-node/recipe/session';
import { AuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';

import { MetadataService } from './metadata.service';
import UserRoles from 'supertokens-node/recipe/userroles';

@Controller('metadata')
export class MetadataController {
  constructor(private metadataService: MetadataService) {}

  @Get()
  @UseGuards(
    new AuthGuard({
      overrideGlobalClaimValidators: async (
        globalValidators: SessionClaimValidator[],
      ) => [
        ...globalValidators,
        // check if is admin
        UserRoles.UserRoleClaim.validators.includes('admin'),
        // UserRoles.PermissionClaim.validators.includes("edit")
      ],
    }),
  )
  async getMetadata(
    @Session() session: SessionContainer,
  ): Promise<{ message: string }> {
    const userId = session.getUserId();

    const { metadata } = await this.metadataService.get(userId);
    return metadata;
  }
}
