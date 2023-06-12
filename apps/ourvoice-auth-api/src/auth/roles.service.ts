import UserRoles from 'supertokens-node/recipe/userroles';
import { SessionContainer } from 'supertokens-node/recipe/session';

export async function createRole(name: string, permissions: string[] = []) {
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

export async function addRoleToUser(
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

export async function getRolesForUser(userId: string): Promise<string[]> {
  const response = await UserRoles.getRolesForUser(userId);
  return response.roles;
}

export async function getUsersThatHaveRole(
  role: 'user' | 'moderator' | 'admin' | 'super',
): Promise<string[]> {
  const response = await UserRoles.getUsersThatHaveRole(role);

  if (response.status === 'UNKNOWN_ROLE_ERROR') {
    // No such role exists
    return;
  }

  return response.users;
}

export async function removeRoleFromUserAndTheirSession(
  session: SessionContainer,
  role: 'user' | 'moderator' | 'admin' | 'super',
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

export async function removeRoleFromUser(
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
