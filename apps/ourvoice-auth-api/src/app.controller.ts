import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';

import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from './auth/auth.guard';
import { Session } from './auth/session.decorator';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import EmailVerification, {
  EmailVerificationClaim,
} from 'supertokens-node/recipe/emailverification';
import Passwordless from 'supertokens-node/recipe/passwordless';
import {
  addEmailToAllowlist,
  removeEmailFromAllowlist as removeEmailFromAllowlist,
} from './auth/metadata.service';
import { PasswordlessUser } from 'supertokens-node/lib/build/recipe/dashboard/types';
import config from './config/configuration';

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
    return JSON.stringify({
      sessionHandle: session?.getHandle(),
      userId: session?.getUserId(),
      accessTokenPayload: session?.getAccessTokenPayload(),
    });
  }

  @Post('changeEmail')
  @UseGuards(new AuthGuard())
  async changeEmail(
    @Session() session: SessionContainer,
    @Body()
    body: {
      newEmail: string;
    },
  ) {
    const allowList = (await UserMetadata.getUserMetadata('emailAllowList'))
      .metadata.allowList as string[];
    const newEmail = body.newEmail;
    if (allowList.includes(newEmail)) {
      throw new BadRequestException('Email has already been registered');
    }
    const isVerified = await EmailVerification.isEmailVerified(
      session.getUserId(),
      newEmail,
    );
    const user = await Passwordless.getUserById({
      userId: session.getUserId(),
    });
    if (!user) {
      throw new BadRequestException(
        'Changing email is only supported for passwordless users',
      );
    }
    const currentEmail = user.email;
    if (currentEmail === newEmail) {
      throw new BadRequestException('Email is the same');
    }
    if (!isVerified) {
      const token = await EmailVerification.createEmailVerificationToken(
        user.id,
        newEmail,
      );
      if (token.status === 'EMAIL_ALREADY_VERIFIED_ERROR') {
        throw new Error('Email already verified');
      }
      await EmailVerification.sendEmail({
        type: 'EMAIL_VERIFICATION',
        user: { id: user.id, email: newEmail },
        emailVerifyLink:
          config().supertokens.websiteDomain +
          '/verify-change-email?token=' +
          token.token,
      });
      return { result: 'OK' };
    }
    await this.updateUserEmail(user, newEmail);
    return { result: 'OK' };
  }

  @Post('verifyEmail')
  async verifyEmail(@Body() body: { token: string }) {
    const result = await EmailVerification.verifyEmailUsingToken(body.token);
    if (result.status === 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR') {
      throw new BadRequestException('bad verification token');
    }
    const originalUser = await Passwordless.getUserById({
      userId: result.user.id,
    });
    await this.updateUserEmail(originalUser, result.user.email);
    return { result: 'OK' };
  }

  private async updateUserEmail(user: Passwordless.User, newEmail: string) {
    await addEmailToAllowlist(newEmail);
    await Passwordless.updateUser({
      userId: user.id,
      email: newEmail,
    });
    await removeEmailFromAllowlist(user.email);
  }
}
