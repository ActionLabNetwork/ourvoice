import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from './auth/auth.guard';
import { Session } from './auth/session.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  @UseGuards(new AuthGuard())
  async getTest(@Session() session: SessionContainer): Promise<string> {
    // TODO: magic
    console.log(session);
    return 'magic';
  }

  @Get('sessioninfo')
  @UseGuards(new AuthGuard())
  async getSessioninfo(@Session() session: SessionContainer): Promise<string> {
    // TODO: magic
    return JSON.stringify({
      sessionHandle: session?.getHandle(),
      userId: session?.getUserId(),
      accessTokenPayload: session?.getAccessTokenPayload(),
    });
  }
}
