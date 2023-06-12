import { Logger, Injectable } from '@nestjs/common';
import { Metadata } from './metadata.interface';

import UserMetadata from 'supertokens-node/recipe/usermetadata';

@Injectable()
export class MetadataService {
  private readonly logger = new Logger('MetadataService');

  async get(userId: string) {
    return await UserMetadata.getUserMetadata(userId);
  }

  async update(userId: string, metadata: Metadata) {
    return await UserMetadata.updateUserMetadata(userId, metadata);
  }

  async clear(userId: string) {
    return await UserMetadata.clearUserMetadata(userId);
  }
  async checkDeployment(
    adminId: string,
    userId: string,
  ): Promise<any | boolean> {
    const adminMetadata = await this.get(adminId);
    const userMetadata = await this.get(userId);
    if (
      adminMetadata.metadata.deployment === userMetadata.metadata.deployment
    ) {
      return userMetadata.metadata;
    }
    return false;
  }
}
