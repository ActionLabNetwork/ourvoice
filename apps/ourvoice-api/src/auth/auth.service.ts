import * as sha256 from 'crypto-js/sha256';
import * as Base64 from 'crypto-js/enc-base64';

import { Inject, Injectable } from '@nestjs/common';
import { AuthModuleConfig, ConfigInjectionToken } from './config.interface';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Injectable()
export class AuthService {
  private readonly globalPepper: string;

  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    this.globalPepper = config.globalPepper;
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

  async validateModeratorHash(
    session: SessionContainer,
    moderatorHash: string,
  ): Promise<void> {
    const verifyHashesAreEqual = async (
      session: SessionContainer,
      hash: string,
    ): Promise<boolean> => {
      const userId = session.getUserId();
      const deployment = session['userDataInAccessToken'].deployment;
      const sessionHash = await this.hashInput(userId, deployment);

      return sessionHash === hash;
    };

    const hashesAreEqual = await verifyHashesAreEqual(session, moderatorHash);

    if (!hashesAreEqual) {
      throw new Error(
        'The moderator hash provided does not match the session hash',
      );
    }
  }
}
