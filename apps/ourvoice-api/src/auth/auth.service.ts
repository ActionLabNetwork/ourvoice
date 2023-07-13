import * as sha256 from 'crypto-js/sha256';
import * as Base64 from 'crypto-js/enc-base64';

import { Inject, Injectable } from '@nestjs/common';
import { AuthModuleConfig, ConfigInjectionToken } from './config.interface';

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
}
