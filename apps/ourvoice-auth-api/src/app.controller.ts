import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';

import EmailVerification from 'supertokens-node/recipe/emailverification';
import Passwordless from 'supertokens-node/recipe/passwordless';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from './auth/auth.guard';
import {
  addEmailToAllowlist,
  isEmailAllowed,
  removeEmailFromAllowlist,
} from './auth/metadata.service';
import { Session } from './auth/session.decorator';
import { isEmailChangeAllowed } from 'supertokens-node/recipe/accountlinking';
import supertokens from 'supertokens-node';

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
    const { newEmail } = body;
    const user = await supertokens.getUser(session.getUserId());
    const currentEmail =
      user.loginMethods.find((method) => method.recipeId === 'passwordless')
        ?.email ?? user.emails[0];

    if (!this.isValidEmail(newEmail)) {
      throw new BadRequestException('Email is invalid');
    }
    const isVerified = await EmailVerification.isEmailVerified(
      session.getRecipeUserId(),
      newEmail,
    );

    if (!isVerified) {
      if (
        !(await isEmailChangeAllowed(
          session.getRecipeUserId(),
          newEmail,
          false,
        ))
      ) {
        // this can come here if you have enabled the account linking feature, and
        // if there is a security risk in changing this user's email.
        throw new BadRequestException(
          'Email change not allowed. Please contact support',
        );
      }
      const user = (await supertokens.getUser(session.getUserId()))!;
      for (let i = 0; i < user?.tenantIds.length; i++) {
        // Since once user can be shared across many tenants, we need to check if
        // the email already exists in any of the tenants.
        const usersWithEmail = await supertokens.listUsersByAccountInfo(
          user?.tenantIds[i],
          {
            email: newEmail,
          },
        );
        for (let y = 0; y < usersWithEmail.length; y++) {
          if (usersWithEmail[y].id !== session.getUserId()) {
            throw new BadRequestException('Email has already been registered');
          }
        }

        // Now we create and send the email verification link to the user for the new email.
        await EmailVerification.sendEmailVerificationEmail(
          session.getTenantId(),
          session.getUserId(),
          session.getRecipeUserId(),
          newEmail,
        );

        return { result: 'OK' };
      }

      if (
        !(await isEmailChangeAllowed(session.getRecipeUserId(), newEmail, true))
      ) {
        // this can come here if you have enabled the account linking feature, and
        // if there is a security risk in changing this user's email.
        throw new BadRequestException(
          'Email change not allowed. Please contact support',
        );
      }

      if (!(await isEmailAllowed(body.newEmail))) {
        throw new BadRequestException('Email has already been registered');
      }
    }

    this.updateUserEmail(session.getRecipeUserId(), currentEmail, newEmail);
  }

  @Post('verifyEmail')
  async verifyEmail(@Body() body: { token: string; tenantId?: string }) {
    const result = await EmailVerification.verifyEmailUsingToken(
      body.tenantId ?? 'public',
      body.token,
    );
    if (result.status === 'EMAIL_VERIFICATION_INVALID_TOKEN_ERROR') {
      throw new BadRequestException('bad verification token');
    }

    this.updateUserEmail(
      result.user.recipeUserId,
      result.user.email,
      result.user.email,
    );
  }

  private async updateUserEmail(
    recipeUserId: supertokens.RecipeUserId,
    oldEmail: string,
    newEmail: string,
  ) {
    await addEmailToAllowlist(newEmail);
    const resp = await Passwordless.updateUser({
      recipeUserId,
      email: newEmail,
    });
    await removeEmailFromAllowlist(oldEmail);

    if (resp.status === 'OK') {
      return { result: 'OK' };
    }
    if (resp.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
      throw new BadRequestException('Email has already been registered');
    }
    throw new Error('Should never come here');
  }

  private isValidEmail(email: string) {
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    return regexp.test(email);
  }
}
