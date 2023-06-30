import { Logger, Injectable } from '@nestjs/common';
import { getUsersNewestFirst } from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Error as STError } from 'supertokens-node/recipe/session';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  async getUsers(recipe: string) {
    // get for specific recipes
    return await getUsersNewestFirst({
      includeRecipeIds: [recipe],
    });
  }
  async getUserInfo(userId: string) {
    // / You can learn more about the `User` object over here https://github.com/supertokens/core-driver-interface/wiki
    return await EmailPassword.getUserById(userId);
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
