# 🔊 Ourvoice

<b>Monorepo for OurVoice System </b>

A safe space for employees and community members to anonymously discuss issues and concerns about their work environments.

## 📖 Documentation

> TBD

## 🐱‍💻 Installation & Development

### Installation

> TBD

### Development

#### Suggested IDEA and plugins:

- [VSCode](https://code.visualstudio.com/)
- [Restore Terminals](https://marketplace.visualstudio.com/items?itemName=EthanSK.restore-terminals) (to spawn VSCode integrated terminals and run commands on startup)

#### Prerequisites:

In order to achieve local development frontend cookie sharing for subdomains you need to modify local host file (`C:\Windows\system32\drivers\etc` on Windows and `/etc/hosts` on Unix) and add following

```bash
127.0.0.1 portal.ourvoice.test
127.0.0.1 app.ourvoice.test
127.0.0.1 auth.ourvoice.test
127.0.0.1 api.ourvoice.test
127.0.0.1 authapi.ourvoice.test
127.0.0.1 admin.ourvoice.test
127.0.0.1 demo.ourvoice.test
```

This also links to the nginx `reverse-proxy` deployed via `docker-compose` file. If you add any additional app subdomains you also need to add redirection and modify `nginx` proxy configuration in [/deployment/init/nginx](/deployment/init/nginx).

> NOTE: This is only needed for local development, production will have its own reverse proxy installed and domains are handled with DNS records.

#### Setup:

- Run from the root `pnpm install` to install dependencies (also runs `pnpm postinstall` and copies all `.env` files)
- Run from deployment `docker compose up -d` to start services (`reverse-proxy`, `supertokens`, `databases`, `localstack`)
- Run from deployment `docker compose exec ourvoice-contact-form-db mongosh --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'localhost:27017'}]});"` for contact-form-db setup.
- Run from the root `pnpm generate:api:all` and `pnpm migrate:api:all` for database setup.
- Run `pnpm seed:api:all` for database seeding.
- Run `pnpm dev:apps` to start all applications in development mode
  > NOTE: if you get any Prisma errors then run the generate and migrate scrips one by one.

#### Test Setup:

- Run from the root `pnpm test:api` to run unit tests for the api
- Run from the root `pnpm test:api:integration` to run integration tests for the api

#### Regular use:

- Run `pnpm dev:apps` to start all applications in development mode
  > NOTE: if you get any Prisma errors then run the generate and migrate scrips one by one.

Navigate to `http://demo.ourvoice.test/` to access the OurVoice App or `http://admin.ourvoice.test` for OurVoice Admin app

> NOTE: to be able to login without password and use email sending functions from the APIs add correct SMTP configurations to `apps/ourvoice-out-api/.env` and `apps/ourvoice-api/.env`

#### Irregular use:

- Run `pnpm dev` in corresponding `app` directory (`app`, `api` or `admin`) to start that app in development mode
- Run from the root `pnpm run clean` to clean all apps directories (delete `dist` and `node_modules`) folders. Assume this is needed after pulling an updated version of the code from the remote repository.
- Run from the root `pnpm lint` to show all lint errors and `pnpm lint:fix` to auto fix if possible

Local ports and URL reference:
| Service | Port | Dev URL |
| ------- | ---- | -------------------------------- |
| Portal | 3011 | http://portal.ourvoice.test/ |
| App | 3010 | http://demo.ourvoice.test/ |
| Admin | 3020 | http://admin.ourvoice.test/ |
| Auth | 3030 | http://auth.ourvoice.test/ |
| API | 3000 | http://api.ourvoice.test/ |
| Auth API| 3001 | http://authapi.ourvoice.test/ |

> NOTE: currently only `demo` deployment is added via [config/config.yml](./config/config.yml). If more is added then they also need to be added to the `hosts` file described in [Prerequisites](####Prerequisites)

## Configuration

### Runtime

All runtime configurations come from corresponding `.env` files:

- `deployment/.env` - all environment variables for docker containers
- `apps/**/.env` - individual app environment variables (used in development)

All these files are copied from `.env.template` on initial run of `pnpm postinstall` script (automatically run after running `pnpm install`)

> NOTE: Files are only copied when they do not exist. If additional environment variables are added to the `.env.template` files, they need to be manually added to each respective `.env` file.

Admin user:

Once the system starts up an `admin` user with credentials from `.env` file is created in the Supertokens database and role `super` with all the permissions assigned. The `admin` user will also have a metadata record of `{ "deployment" : "*" }`, which means it will have access to all existing and future deployment information and can administer users and roles for all deployments.

> NOTE: if `admin` user already exists in the Supertokens database it will just continue.

### Deployment

Deployment configuration is stored in:

- `config/config.yml`
- `apps/ourvoice-api/config/config/.yml`
- `apps/ourvoice-auth-api/config/config.yml`

> NOTE: Config files in both of the API applications are copies of the overall configuration files (not to be changed) and are automatically created via `pnpm postinstall` script (automatically run after running `pnpm install`)

Content:

Content such as deployment specific texts are loaded from `config/content` folder as markdown files and rended as html on application views.

User and role management (email and password sign up only):

To add deployment administrator and moderator users you need to add them to the `moderators` in the root `config/config.yml` file (run `pnpm postinstall` after modification to propagate to application configurations). This will restrict email/password sign up to those specified emails, all other emails will raise an error in the backend when signing up.

Once a user with an email (in `moderators`) has signed up you can use the super admin user (created on startup with credentials in `.env`) to allocate them admin role via the OurVoice Admin application. Once a user has a role `admin` they can log into the OurVoice Admin application to modify rights for their deployment only. See list roles and right below (can be modified based on need).

To add email that can use the passwordless sign in/up you need to add them to `allowedEmails` in the root `config/config.yml` file (run `pnpm postinstall` after modification to propagate to application configurations). If no emails are added this feature is disabled. To restrict the domain for emails that can sign up specify the `organisation` in the root `config/config.yml` file (run `pnpm postinstall` after modification to propagate to application configurations).

> NOTE: Session token is updated using refresh call to API endpoint that checks supertoken database for updates using [Token blacklisting](https://supertokens.com/docs/passwordless/common-customizations/sessions/access-token-blacklisting). This is not a most elegant solution and other options (e.g. keeping a cache of tokens that need to be refreshed) should be used in the future. See more in docs - https://supertokens.com/docs/session/common-customizations/sessions/claims/access-token-payload and https://supertokens.com/docs/session/common-customizations/sessions/claims/access-token-payload#with-session-verification-online-mode

- name: `user`
- permissions:
  - read:all
  - edit:self
  - delete:self
- name: `moderator`
- permissions:
  - read:all
  - edit:all
  - delete:all
- name: `admin`
- permissions:
  - manage:self
  - read:all
  - edit:all
  - delete:all
- name: `super`
- permissions:

  - manage:all
  - read:all
  - edit:all
  - delete:all

- Read all content in specific deployment: `read:all`
- Delete all content in specific deployment: `delete:all`
- Delete content created by self in specific deployment: `delete:self`
- Edit all content in specific deployment: `edit:all`
- Edit content created by self in specific deployment: `edit:self`
- Manage users (and other configurations) in specific deployment: `manage:self`
- Manage all users (and other configurations): `manage:all`

## 🕸️ Structure

### WebApp for users

> TBD

### WebApp for admins

> TBD

### API

> TBD

## ✍️ Contributing

Fork the repo, make some changes, submit a pull-request.

## 📝 License

Apache License © 2023-PRESENT
