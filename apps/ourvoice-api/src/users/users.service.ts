import { Logger, Injectable } from '@nestjs/common';
import { getUsersNewestFirst } from 'supertokens-node';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  async getUsers(recipe: string) {
    // get for specific recipes
    return await getUsersNewestFirst({
      includeRecipeIds: [recipe],
    });
  }
}
