import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import supertokens from 'supertokens-node'
import { errorHandler, middleware } from 'supertokens-node/framework/express'

import { AppModule } from './app.module'
import { SupertokensExceptionFilter } from './auth/auth.filter'
import {
  addEmailsToAllowlist,
  addModeratorsToAllowlist,
  // clearEmailAllowList,
} from './auth/metadata.service'
import { Role } from './auth/roles.interface'
import { createRole } from './auth/roles.service'
import { addSuperAdmin } from './seed'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = await app.get(ConfigService)

  // configService.get<AuthOptions[]>('auth');

  // TODO: add admin and app addresses to list
  const whitelist: string[] = [
    'http://localhost:4173', // cypress
    'http://localhost:4174', // cypress
    `http://localhost:${configService.get<number>('authApi.port')}`, // localhost
    configService.get<string>('authApi.url'), // AUTHAPI
    configService.get<string>('auth.url'), // AUTH
    configService.get<string>('admin.url'), // ADMIN
    configService.get<string>('app.domain'), // DOMAIN
  ]
  // TODO : use regex for all deployment names
  app.enableCors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true)
        return
      }
      // const match = origin
      //   .toLowerCase()
      //   .match(/^https?:\/\/([\w\d]+\.)?ourvoice\.test$/);
      // const domainWhiteList = /^(https?:\/\/([a-z0-9]+[.])ourvoice[.]test(?::\d{1,5})?)$/;
      const parts = origin ? origin.split('.') : origin
      if (
        !origin
        || whitelist.includes(origin)
        || whitelist.includes(`${parts[parts.length - 2]}.${parts[parts.length - 1]}`)
      ) {
        callback(null, true)
      }
      else {
        callback(
          new Error(`Origin ${origin} not permitted due to CORS policy`),
        )
      }
    },
    allowedHeaders: [
      'content-type',
      'deployment',
      ...supertokens.getAllCORSHeaders(),
    ],
    credentials: true,
  })

  app.use(middleware())
  app.use(errorHandler())
  app.useGlobalFilters(new SupertokensExceptionFilter())
  // create roles
  console.log('Creating roles...')
  configService
    .get<Role[]>('roles')
    .map(async role => await createRole(role.name, role.permissions))
  // if you need to clear the allowedEmails list
  // await clearEmailAllowList();
  // add allowed emails who can sign up
  console.log('Updating email allow list...')
  await addEmailsToAllowlist(configService.get<string[]>('allowedEmails'))
  // if you need to clear the allowedEmails list
  // await clearModeratorAllowList();
  // add moderators who can sign up using email
  console.log('Updating moderators list...')
  await addModeratorsToAllowlist(configService.get<string[]>('moderators'))
  // add super admin user
  await addSuperAdmin(
    configService.get<string>('supertokens.adminEmail'),
    configService.get<string>('supertokens.adminPassword'),
  )
  await app.listen(configService.get<number>('authApi.port'))
}

bootstrap()
