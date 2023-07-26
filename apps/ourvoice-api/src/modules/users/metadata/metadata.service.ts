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

  async getAllowlist() {
    return await UserMetadata.getUserMetadata('emailAllowList');
  }

  async addEmailToAllowlist(email: string) {
    const existingData = await UserMetadata.getUserMetadata('emailAllowList');
    let allowList: string[] = existingData.metadata.allowList || [];
    allowList = [...new Set([...allowList, email])];
    await UserMetadata.updateUserMetadata('emailAllowList', {
      allowList,
    });
  }

  async addEmailsToAllowlist(emails: string[]) {
    const existingData = await UserMetadata.getUserMetadata('emailAllowList');
    let allowList: string[] = existingData.metadata.allowList || [];
    allowList = [...new Set([...allowList, ...emails])];
    return await UserMetadata.updateUserMetadata('emailAllowList', {
      allowList,
    });
  }
  async removeEmailFromAllowlist(email: string) {
    const existingData = await UserMetadata.getUserMetadata('emailAllowList');
    let allowList: string[] = existingData.metadata.allowList || [];
    allowList = allowList.filter((e) => e != email);
    return await UserMetadata.updateUserMetadata('emailAllowList', {
      allowList,
    });
  }

  async clearEmailAllowList() {
    return await UserMetadata.clearUserMetadata('emailAllowList');
  }

  async isEmailAllowed(email: string) {
    const existingData = await UserMetadata.getUserMetadata('emailAllowList');
    const allowList: string[] = existingData.metadata.allowList || [];
    // NOTE: if allowlist is empty then this feature is disabled
    return allowList.includes(email) || allowList.length === 0;
  }

  async getModeratorAllowlist() {
    return await UserMetadata.getUserMetadata('phoneNumberAllowList');
  }

  // NOTE: using phoneNumberAllowList as a storage for storing moderators list in supertokens
  // in the future this could be moved to admin/deployment database or if supertokens extends
  // functionality to allow custom storages of metadata not linked to user
  async addModeratorToAllowlist(moderator: string) {
    const existingData = await UserMetadata.getUserMetadata(
      'phoneNumberAllowList',
    );
    let allowList: string[] = existingData.metadata.allowList || [];
    allowList = [...new Set([...allowList, moderator])];
    return await UserMetadata.updateUserMetadata('phoneNumberAllowList', {
      allowList,
    });
  }

  async addModeratorsToAllowlist(moderators: string[]) {
    const existingData = await UserMetadata.getUserMetadata(
      'phoneNumberAllowList',
    );
    let allowList: string[] = existingData.metadata.allowList || [];
    allowList = [...new Set([...allowList, ...moderators])];
    return await UserMetadata.updateUserMetadata('phoneNumberAllowList', {
      allowList,
    });
  }

  async isModeratorAllowed(phoneNumber: string) {
    const existingData = await UserMetadata.getUserMetadata(
      'phoneNumberAllowList',
    );
    const allowList: string[] = existingData.metadata.allowList || [];
    return allowList.includes(phoneNumber);
  }
}
