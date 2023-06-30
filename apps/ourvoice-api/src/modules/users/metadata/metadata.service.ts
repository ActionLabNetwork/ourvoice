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
      adminMetadata.metadata.deployment === userMetadata.metadata.deployment ||
      adminMetadata.metadata.deployment === '*'
    ) {
      return userMetadata.metadata;
    }
    return false;
  }

  async addEmailToAllowlist(email: string) {
    const existingData = await UserMetadata.getUserMetadata('emailAllowList');
    let allowList: string[] = existingData.metadata.allowList || [];
    allowList = [...allowList, email];
    await UserMetadata.updateUserMetadata('emailAllowList', {
      allowList,
    });
  }

  async isEmailAllowed(email: string) {
    const existingData = await UserMetadata.getUserMetadata('emailAllowList');
    const allowList: string[] = existingData.metadata.allowList || [];
    return allowList.includes(email);
  }

  async addPhoneNumberToAllowlist(phoneNumber: string) {
    const existingData = await UserMetadata.getUserMetadata(
      'phoneNumberAllowList',
    );
    let allowList: string[] = existingData.metadata.allowList || [];
    allowList = [...allowList, phoneNumber];
    await UserMetadata.updateUserMetadata('phoneNumberAllowList', {
      allowList,
    });
  }

  async isPhoneNumberAllowed(phoneNumber: string) {
    const existingData = await UserMetadata.getUserMetadata(
      'phoneNumberAllowList',
    );
    const allowList: string[] = existingData.metadata.allowList || [];
    return allowList.includes(phoneNumber);
  }
}
