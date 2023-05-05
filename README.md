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

- Run from deployment `docker compose up -d` to start services (`reverse-proxy`, `supertokens`, `databases`)
- Run from the root `pnpm install` to install dependencies (also runs `pnpm postinstall` and copies all `.env` files)
- Run from the root `pnpm generate:api:all` and `pnpm migrate:api:all` for database setup.
- Run `pnpm dev:apps` to start all applications in development mode

> NOTE: if you get any Prisma errors then run the generate and migrate scrips one by one.

Irregular use:

- Run `pnpm dev` in corresponding `app` directory to start that app in development mode
- Run from the root `pnpm run clean` to clean all apps directories (delete `dist` and `node_modules`) folders. Assume this is needed after pulling an updated version of the code from the remote repository.
- Run from the root `pnpm lint` to show all lint errors and `pnpm lint:fix` to auto fix if possible

Local ports reference:
| Service | Port |
| ------- | ----- |
| Portal | 3011 |
| App | 3010 |
| Admin | 3020 |
| Auth | 3030 |
| API | 3000 |
| Auth API| 3001 |

## 🕸️ Structure

### WebApp for users

> TBD

### WebApp for admins

>

### API

> TBD

## ✍️ Contributing

Fork the repo, make some changes, submit a pull-request.

## 📝 License

Apache License © 2023-PRESENT
