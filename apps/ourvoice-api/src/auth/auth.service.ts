import * as sha256 from 'crypto-js/sha256';
import * as Base64 from 'crypto-js/enc-base64';

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthModuleConfig, ConfigInjectionToken } from './config.interface';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Injectable()
export class AuthService {
  private readonly globalPepper: string;
  private readonly deployment: string;

  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    this.globalPepper = config.globalPepper;
    this.deployment = config.deployment;
  }

  async hashInput(input: string, deployment: string): Promise<string> {
    return sha256(input + deployment + this.globalPepper).toString(Base64);
  }

  async verifyHash(
    input: string,
    deployment: string,
    hash: string,
  ): Promise<boolean> {
    return (await this.hashInput(input, deployment)) === hash;
  }

  async validateClaimedHash(
    session: SessionContainer,
    claimedHash: string,
  ): Promise<void> {
    const verifyHashesAreEqual = async (
      session: SessionContainer,
      hash: string,
    ): Promise<boolean> => {
      const userId = session.getUserId();
      const sessionHash = await this.hashInput(userId, this.deployment);

      return sessionHash === hash;
    };

    const hashesAreEqual = await verifyHashesAreEqual(session, claimedHash);
    if (!hashesAreEqual) {
      throw new BadRequestException(
        'The claimed hash provided does not match the session hash',
      );
    }
  }
}
