import { Logger, Injectable } from '@nestjs/common';
import { getUsersNewestFirst } from 'supertokens-node';
import supertokens from 'supertokens-node';
import UserRoles from 'supertokens-node/recipe/userroles';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Error as STError } from 'supertokens-node/recipe/session';

const DEFAULT_TENANT_ID = 'public';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  async getUsers(recipe: string, tenantId?: string) {
    // get for specific recipes
    return await getUsersNewestFirst({
      tenantId: tenantId ?? DEFAULT_TENANT_ID,
      includeRecipeIds: [recipe],
    });
  }
  async getUserInfo(userId: string) {
    // / You can learn more about the `User` object over here https://github.com/supertokens/core-driver-interface/wiki
    return await supertokens.getUser(userId);
  }

  async isAdmin(session: SessionContainer) {
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
  }
}
