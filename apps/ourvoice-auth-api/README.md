# OurVoice Auth API

## Description

OurVoice authentication API repository based on [Nest](https://github.com/nestjs/nest) framework TypeScript starter template and implements [Supertokens](https://github.com/supertokens/supertokens-node).

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Supertokens Dashboard

You can access Supertokens dashboard in dev from http://authapi.ourvoice.test/auth/dashboard/
Use `SUPERTOKENS_API_KEY` specified in `.env` for login.

## Adding User Roles

Roles `user`, `moderator` and `admin` are created on deployment in Supertokens database and `user` role is automatically signed to each new user. You can assign extra roles to users beforehand or immediately after they sign up. Use `SUPERTOKENS_API_KEY` specified in `.env` for `api-key`.

Manage roles in dev using CURL:

```bash
# get all users
curl --location --request GET 'http://localhost:3567/recipe/role/users?role=user' \
--header 'api-key: <API_KEY(if configured)>'

# add moderator role to specific user (use the id of user from first request)
curl --location --request PUT 'http://localhost:3567/recipe/user/role' \
--header 'api-key: api-key: <API_KEY(if configured)>' \
--header 'Content-Type: application/json; charset=utf-8' \
--data-raw '{
  "userId": "<USER_ID>",
  "role": "moderator"
}'
# check roles assigned to user
curl --location --request GET 'http://localhost:3567/recipe/user/roles?userId=<USER_ID>' \
--header 'api-key: api-key: <API_KEY(if configured)>'
```

Read more about user role management from [Supertokens official documentation](https://supertokens.com/docs/userroles/managing-roles-and-users)
