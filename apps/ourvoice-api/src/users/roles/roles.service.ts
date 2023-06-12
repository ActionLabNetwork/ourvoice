import { Logger, Injectable } from '@nestjs/common';
import UserRoles from 'supertokens-node/recipe/userroles';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Injectable()
export class RolesService {
  private readonly logger = new Logger('RolesService');

  async createRole(name: string, permissions: string[] = []) {
    /**
     * You can choose to give multiple or no permissions when creating a role
     * createNewRoleOrAddPermissions("user", []) - No permissions
     * createNewRoleOrAddPermissions("user", ["read", "write"]) - Multiple permissions
     */
    const response = await UserRoles.createNewRoleOrAddPermissions(
      name,
      permissions,
    );

    if (response.createdNewRole === false) {
      // The role already exists
    }
  }

  async addRoleToUser(
    userId: string,
    role: 'user' | 'moderator' | 'admin' | 'super',
  ) {
    const response = await UserRoles.addRoleToUser(userId, role);

    if (response.status === 'UNKNOWN_ROLE_ERROR') {
      // No such role exists
      return;
    }

    if (response.didUserAlreadyHaveRole === true) {
      // The user already had the role
    }
  }

  async getRolesForUser(userId: string): Promise<string[]> {
    const response = await UserRoles.getRolesForUser(userId);
    return response.roles;
  }

  async getUsersThatHaveRole(role: string): Promise<string[]> {
    const response = await UserRoles.getUsersThatHaveRole(role);

    if (response.status === 'UNKNOWN_ROLE_ERROR') {
      // No such role exists
      return;
    }

    return response.users;
  }

  async removeRoleFromUserAndTheirSession(
    session: SessionContainer,
    role: string,
  ) {
    const response = await UserRoles.removeUserRole(session.getUserId(), role);
    if (response.status === 'UNKNOWN_ROLE_ERROR') {
      // No such role exists
      return;
    }

    if (response.didUserHaveRole === false) {
      // The user was never assigned the role
    } else {
      // We also want to update the session of this user to reflect this change.
      await session.fetchAndSetClaim(UserRoles.UserRoleClaim);
      await session.fetchAndSetClaim(UserRoles.PermissionClaim);
    }
  }
  async removeRoleFromUser(
    userId: string,
    role: 'user' | 'moderator' | 'admin' | 'super',
  ) {
    const response = await UserRoles.removeUserRole(userId, role);

    if (response.status === 'UNKNOWN_ROLE_ERROR') {
      // No such role exists
      return;
    }

    if (response.didUserHaveRole === false) {
      // The user was never assigned the role
    }
  }
}
