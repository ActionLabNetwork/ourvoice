import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from '../../auth/auth.guard';
import { Session } from '../../auth/session.decorator';
import { UsersService } from './users.service';
import { MetadataService } from './metadata/metadata.service';
import { RolesService } from './roles/roles.service';
import { UserRole } from './roles/roles.interface';

@Controller('users')
export class UserController {
  constructor(
    private userService: UsersService,
    private metadataService: MetadataService,
    private rolesService: RolesService,
  ) {}
  // get info for current session user
  @Get('me')
  @UseGuards(new AuthGuard())
  async getProfile(@Session() session: SessionContainer): Promise<string> {
    const userId = session.getUserId();
    // You can learn more about the `User` object over here https://github.com/supertokens/core-driver-interface/wiki
    const userInfo = await this.userService.getUserInfo(userId);
    return JSON.stringify({
      userId: userInfo?.id,
      emails: userInfo?.emails,
      joined: userInfo?.timeJoined,
    });
  }
  // get metadata for current session user
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
  @UseGuards(new AuthGuard())
  async getUserMetadata(
    @Session() session: SessionContainer,
    @Param('id') id: string,
  ): Promise<{ metadata: any }> {
    // check if admin
    await this.userService.isAdmin(session);

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
    const now = new Date().toISOString();
    const { status } = await this.metadataService.update(userId, {
      consent: now,
    });
    // TODO: error handling
    if (status === 'OK') {
      // update session payload
      await session.mergeIntoAccessTokenPayload({
        consent: now,
      });
      return { message: 'successfully updated user consent' };
    }
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
  @UseGuards(new AuthGuard())
  async getUsers(
    @Session() session: SessionContainer,
  ): Promise<{ users: any }> {
    // check if has admin rights
    await this.userService.isAdmin(session);
    // user is an admin or super admin
    const adminId = session.getUserId();
    // TODO: add user pagination
    const allUsers = await this.userService.getUsers('emailpassword');
    const deploymentUsers = allUsers.users.flatMap(async (object) => {
      // check if self
      if (adminId === object.id) {
        return [];
      } else {
        // check if admin is allowed to manage (deployments match)
        const metadata = await this.metadataService.checkDeployment(
          adminId,
          object.id,
        );
        if (metadata) {
          const roles = await this.rolesService.getRolesForUser(object.id);
          return [
            {
              id: object.id,
              email: object.emails,
              roles,
              ...metadata,
            },
          ];
        }
        return [];
      }
    });
    const invitedModerators =
      (await this.metadataService.getModeratorAllowlist()).metadata.allowList ||
      [];
    const moderators = (await Promise.all([...deploymentUsers])).flat();
    const allModerators = invitedModerators.reduce(
      (acc, val) =>
        moderators.find((e) => e.email === val)
          ? acc
          : acc.concat({ id: null, email: val, roles: [] }),
      [],
    );
    return {
      users: [...allModerators, ...moderators],
    };
  }
  // assign role to specific user
  @Put('role/:id')
  @UseGuards(new AuthGuard())
  async updateRole(
    @Session() session: SessionContainer,
    @Param('id') id: string,
    @Body()
    update: {
      role: UserRole;
      assign: boolean;
    },
  ): Promise<{ message: string }> {
    // check of admin
    await this.userService.isAdmin(session);

    // user is an admin or super admin
    const adminId = session.getUserId();
    // check if is deployment matches
    const metadata = await this.metadataService.checkDeployment(adminId, id);
    // TODO: error handling
    if (metadata) {
      update.assign
        ? await this.rolesService.addRoleToUserAndTheirSession(id, update.role)
        : await this.rolesService.removeRoleFromUserAndTheirSession(
            id,
            update.role,
          );
      return { message: 'role changed successfully' };
    }
  }
  // assign role to specific user
  @Put('moderators')
  @UseGuards(new AuthGuard())
  async addModerators(
    @Session() session: SessionContainer,
    @Body()
    add: {
      moderators: string[];
    },
  ): Promise<{ message: string }> {
    // check of admin
    await this.userService.isAdmin(session);
    // user is an admin or super admin
    // TODO: error handling
    const { status } = await this.metadataService.addModeratorsToAllowlist(
      add.moderators,
    );
    if (status === 'OK')
      return { message: 'successfully updated moderator email list' };
  }

  @Get('allowed')
  @UseGuards(new AuthGuard())
  async getAllowed(
    @Session() session: SessionContainer,
  ): Promise<{ users: any }> {
    // check if has admin rights
    await this.userService.isAdmin(session);
    // user is an admin or super admin
    // TODO: error handling
    const { status, metadata } = await this.metadataService.getAllowlist();
    if (status === 'OK')
      return {
        users: metadata.allowList || [],
      };
  }

  // assign allowed emails
  @Put('allowed')
  @UseGuards(new AuthGuard())
  async addAllowedEmails(
    @Session() session: SessionContainer,
    @Body()
    add: {
      emails: string[];
    },
  ): Promise<{ message: string }> {
    // check of admin
    await this.userService.isAdmin(session);
    // user is an admin or super admin
    // TODO: error handling
    const { status } = await this.metadataService.addEmailsToAllowlist(
      add.emails,
    );
    if (status === 'OK')
      return { message: 'successfully updated email allow list' };
  }
  // assign allowed emails
  @Delete('allowed')
  @UseGuards(new AuthGuard())
  async removeAllowedEmail(
    @Session() session: SessionContainer,
    @Body()
    remove: {
      email: string;
    },
  ): Promise<{ message: string }> {
    // check of admin
    await this.userService.isAdmin(session);
    // user is an admin or super admin
    // TODO: error handling
    const { status } = await this.metadataService.removeEmailFromAllowlist(
      remove.email,
    );
    if (status === 'OK')
      return { message: 'successfully updated email allow list' };
  }
}
