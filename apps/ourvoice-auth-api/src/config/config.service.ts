import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, any>;
  private;

  constructor() {
    this.envConfig = dotenv.parse(readFileSync(`.env`)) as Record<string, any>;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
