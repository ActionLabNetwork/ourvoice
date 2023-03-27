import UserRoles from 'supertokens-node/recipe/userroles';
import { SessionContainer } from 'supertokens-node/recipe/session';

async function createRole() {
  /**
   * You can choose to give multiple or no permissions when creating a role
   * createNewRoleOrAddPermissions("user", []) - No permissions
   * createNewRoleOrAddPermissions("user", ["read", "write"]) - Multiple permissions
   */
  const response = await UserRoles.createNewRoleOrAddPermissions('user', [
    'read',
  ]);

  if (response.createdNewRole === false) {
    // The role already exists
  }
}

async function addRoleToUser(userId: string) {
  const response = await UserRoles.addRoleToUser(userId, 'user');

  if (response.status === 'UNKNOWN_ROLE_ERROR') {
    // No such role exists
    return;
  }

  if (response.didUserAlreadyHaveRole === true) {
    // The user already had the role
  }
}

async function getRolesForUser(userId: string) {
  const response = await UserRoles.getRolesForUser(userId);
  const roles: string[] = response.roles;
}

async function getUsersThatHaveRole(role: string) {
  const response = await UserRoles.getUsersThatHaveRole(role);

  if (response.status === 'UNKNOWN_ROLE_ERROR') {
    // No such role exists
    return;
  }

  const users: string[] = response.users;
}

async function removeRoleFromUserAndTheirSession(session: SessionContainer) {
  const response = await UserRoles.removeUserRole(session.getUserId(), 'user');

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
