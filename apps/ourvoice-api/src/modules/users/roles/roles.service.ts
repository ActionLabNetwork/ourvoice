import { Logger, Injectable } from '@nestjs/common';
import UserRoles from 'supertokens-node/recipe/userroles';
import Session from 'supertokens-node/recipe/session';
import { UserRole } from './roles.interface';

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

  async addRoleToUserAndTheirSession(userId: string, role: UserRole) {
    const response = await UserRoles.addRoleToUser(userId, role);

    if (response.status === 'UNKNOWN_ROLE_ERROR') {
      // No such role exists
      return;
    }

    if (response.didUserAlreadyHaveRole === true) {
      // The user already had the role
    } else {
      this.updateSessionClaims(userId);
    }
  }

  async getRolesForUser(userId: string): Promise<string[]> {
    const response = await UserRoles.getRolesForUser(userId);
    return response.roles;
  }

  async getUsersThatHaveRole(role: UserRole): Promise<string[] | undefined> {
    const response = await UserRoles.getUsersThatHaveRole(role);

    if (response.status === 'UNKNOWN_ROLE_ERROR') {
      // No such role exists
      return;
    }

    return response.users;
  }

  async removeRoleFromUserAndTheirSession(userId: string, role: UserRole) {
    const response = await UserRoles.removeUserRole(userId, role);
    if (response.status === 'UNKNOWN_ROLE_ERROR') {
      // No such role exists
      return;
    }

    if (response.didUserHaveRole === false) {
      // The user was never assigned the role
    } else {
      this.updateSessionClaims(userId);
    }
  }

  async updateSessionClaims(userId: string) {
    // we update all the session's Access Token payloads for this user
    // TODO: still doesn't update frontend token
    const sessionHandles = await Session.getAllSessionHandlesForUser(userId);
    sessionHandles.forEach(async (handle) => {
      const currSessionInfo = await Session.getSessionInformation(handle);
      if (currSessionInfo === undefined) {
        return;
      }
      await Session.fetchAndSetClaim(handle, UserRoles.UserRoleClaim);
      await Session.fetchAndSetClaim(handle, UserRoles.PermissionClaim);
    });
  }
}
