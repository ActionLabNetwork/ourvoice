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
}
