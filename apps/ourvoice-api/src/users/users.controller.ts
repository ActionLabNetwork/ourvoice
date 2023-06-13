import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import {
  SessionContainer,
  SessionClaimValidator,
} from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { AuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';
import UserRoles from 'supertokens-node/recipe/userroles';
import { UsersService } from './users.service';
import { MetadataService } from './metadata/metadata.service';
import { RolesService } from './roles/roles.service';
import { Error as STError } from 'supertokens-node/recipe/session';

@Controller('users')
export class UserController {
  constructor(
    private userService: UsersService,
    private metadataService: MetadataService,
    private rolesService: RolesService,
  ) {}
  @Get('me')
  @UseGuards(new AuthGuard())
  async getProfile(@Session() session: SessionContainer): Promise<string> {
    const userId = session.getUserId();
    // You can learn more about the `User` object over here https://github.com/supertokens/core-driver-interface/wiki
    // TODO: move to userService
    const userInfo = await EmailPassword.getUserById(userId);
    return JSON.stringify({
      userId: userInfo?.id,
      email: userInfo?.email,
      joined: userInfo?.timeJoined,
    });
  }
  @Get('metadata')
  @UseGuards(new AuthGuard())
  async getMetadata(
    @Session() session: SessionContainer,
  ): Promise<{ metadata: any }> {
    const userId = session.getUserId();

    const { status, metadata } = await this.metadataService.get(userId);
    // TODO: error handling
    if (status === 'OK') return { metadata };
  }
  @Get('metadata/:id')
  @UseGuards(
    new AuthGuard({
      overrideGlobalClaimValidators: async (
        globalValidators: SessionClaimValidator[],
      ) => [
        ...globalValidators,
        // check if user is admin
        UserRoles.UserRoleClaim.validators.includes('admin'),
        // check if user can manage deployment
        UserRoles.PermissionClaim.validators.includes('manage:self'),
      ],
    }),
  )
  async getUserMetadata(
    @Session() session: SessionContainer,
    @Param('id') id: string,
  ): Promise<{ metadata: any }> {
    const adminId = session.getUserId();
    // TODO: error handling
    const metadata = await this.metadataService.checkDeployment(adminId, id);
    if (metadata) {
      return { metadata };
    }
  }
  @Put('consent')
  @UseGuards(new AuthGuard())
  async updateConsent(
    @Session() session: SessionContainer,
  ): Promise<{ message: string }> {
    const userId = session.getUserId();

    const { status } = await this.metadataService.update(userId, {
      consent: new Date().toISOString(),
    });
    // TODO: error handling
    if (status === 'OK')
      return { message: 'successfully updated user consent' };
  }
  //   Probably not needed as an endpoint
  @Post('consent/check')
  @UseGuards(new AuthGuard())
  async checkConsent(
    @Session() session: SessionContainer,
    @Body() policyDate: string,
  ): Promise<{ message: string }> {
    const userId = session.getUserId();
    const { status, metadata } = await this.metadataService.get(userId);
    // TODO: error handling
    if (status === 'OK') {
      if (metadata.consent > policyDate)
        return { message: 'successfully updated user consent' };
      else {
        return { message: 'new consent needed' };
      }
    }
  }
  // get all users in specific deployment
  @Get()
  @UseGuards(
    new AuthGuard(),
    //   {
    //   overrideGlobalClaimValidators: async (
    //     globalValidators: SessionClaimValidator[],
    //   ) => [
    //     ...globalValidators,
    //     // check if user is admin
    //     UserRoles.UserRoleClaim.validators.includes('admin'),
    //     // check if user can manage deployment
    //     UserRoles.PermissionClaim.validators.includes('manage:self'),
    //   ],
    // }
  )
  async getUsers(
    @Session() session: SessionContainer,
  ): Promise<{ users: any }> {
    const roles = await session.getClaimValue(UserRoles.UserRoleClaim);
    if (
      roles === undefined ||
      (!roles.includes('admin') && !roles.includes('super'))
    ) {
      // this error tells SuperTokens to return a 403 to the frontend.
      throw new STError({
        type: 'INVALID_CLAIMS',
        message: 'User is not an admin',
        payload: [
          {
            id: UserRoles.UserRoleClaim.key,
          },
        ],
      });
    }
    const allUsers = await this.userService.getUsers('emailpassword');
    // user is an admin or super admin
    const adminId = session.getUserId();
    // const users = await this.rolesService.getUsersThatHaveRole('user');
    // const moderators = await this.rolesService.getUsersThatHaveRole(
    //   'moderator',
    // );
    const deploymentUsers = allUsers.users.map(async (object) => {
      // check if admin can manage this user's metadata
      if (adminId !== object.user.id) {
        const metadata = await this.metadataService.checkDeployment(
          adminId,
          object.user.id,
        );
        if (metadata) {
          const roles = this.rolesService.getRolesForUser(object.user.id);
          return {
            id: object.user.id,
            email: object.user.email,
            roles,
            ...metadata,
          };
        }
      }
    });
    // const deploymentUsers = users.map(async (user) => {
    //   // check if admin can manage this user's metadata
    //   const metadata = await this.metadataService.checkDeployment(
    //     adminId,
    //     user,
    //   );
    //   if (metadata) return { id: user, role: 'user', ...metadata };
    // });
    // const deploymentModerators = moderators.map(async (user) => {
    //   // check if admin can manage this user's metadata
    //   const metadata = await this.metadataService.checkDeployment(
    //     adminId,
    //     user,
    //   );
    //   if (metadata) return { id: user, role: 'moderator', ...metadata };
    // });
    return {
      users: await Promise.all([...deploymentUsers]),
    };
  }
  // get all users in specific deployment
  @Put('role/:id')
  @UseGuards(
    new AuthGuard(),
    //   {
    //   overrideGlobalClaimValidators: async (
    //     globalValidators: SessionClaimValidator[],
    //   ) => [
    //     ...globalValidators,
    //     // check if user is admin
    //     UserRoles.UserRoleClaim.validators.includes('admin'),
    //     // check if user can manage deployment
    //     UserRoles.PermissionClaim.validators.includes('manage:self'),
    //   ],
    // }
  )
  async updateRole(
    @Session() session: SessionContainer,
    @Param('id') id: string,
    @Body()
    updateRole: {
      oldRole: 'user' | 'moderator' | 'admin' | 'super';
      newRole: 'user' | 'moderator' | 'admin' | 'super';
    },
  ): Promise<{ message: string }> {
    const roles = await session.getClaimValue(UserRoles.UserRoleClaim);
    if (
      roles === undefined ||
      (!roles.includes('admin') && !roles.includes('super'))
    ) {
      // this error tells SuperTokens to return a 403 to the frontend.
      throw new STError({
        type: 'INVALID_CLAIMS',
        message: 'User is not an admin',
        payload: [
          {
            id: UserRoles.UserRoleClaim.key,
          },
        ],
      });
    }
    const adminId = session.getUserId();
    // check if is deployment matches
    const metadata = await this.metadataService.checkDeployment(adminId, id);
    // TODO: error handling
    if (metadata) {
      await this.rolesService.addRoleToUser(id, updateRole.newRole);
      await this.rolesService.removeRoleFromUser(id, updateRole.oldRole);
      return { message: 'role changed successfully' };
    }
  }
}
