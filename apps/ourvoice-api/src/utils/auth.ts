import { UnauthorizedException } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthRoles } from './../types/general';
import UserRoles from 'supertokens-node/recipe/userroles';

const allowedRoles: readonly AuthRoles[] = ['super', 'admin', 'moderator'];
export const hasElevatedPermissions = (roles: AuthRoles[]) => {
  return (
    roles !== undefined &&
    roles.length > 0 &&
    roles.every((role: AuthRoles) => allowedRoles.includes(role))
  );
};

export const validateUserPermission = async (session: SessionContainer) => {
  const roles = (await session.getClaimValue(
    UserRoles.UserRoleClaim,
  )) as AuthRoles[];

  if (!hasElevatedPermissions(roles)) {
    throw new UnauthorizedException();
  }
};
