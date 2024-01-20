import UserRoles from 'supertokens-node/recipe/userroles';
import { SessionContainer } from 'supertokens-node/recipe/session';

const DEFAULT_TENANT_ID = 'public';

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
  const response = await UserRoles.addRoleToUser(
    DEFAULT_TENANT_ID,
    userId,
    role,
  );

  if (response.status === 'UNKNOWN_ROLE_ERROR') {
    // No such role exists
    return;
  }

  if (response.didUserAlreadyHaveRole === true) {
    // The user already had the role
  }
  if (response.status === 'OK') {
    console.log('Role added to user ', userId);
  }
}

export async function getRolesForUser(userId: string) {
  const response = await UserRoles.getRolesForUser(DEFAULT_TENANT_ID, userId);
  return response.roles;
}

export async function getUsersThatHaveRole(
  role: 'user' | 'moderator' | 'admin' | 'super',
) {
  const response = await UserRoles.getUsersThatHaveRole(
    DEFAULT_TENANT_ID,
    role,
  );

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
  const response = await UserRoles.removeUserRole(
    DEFAULT_TENANT_ID,
    session.getUserId(),
    role,
  );

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
  const response = await UserRoles.removeUserRole(
    DEFAULT_TENANT_ID,
    userId,
    role,
  );

  if (response.status === 'UNKNOWN_ROLE_ERROR') {
    // No such role exists
    return;
  }

  if (response.didUserHaveRole === false) {
    // The user was never assigned the role
  }
}
