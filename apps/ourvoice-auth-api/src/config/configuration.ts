export default () => ({
  supertokens: {
    appName: process.env.SUPERTOKENS_APP_NAME || 'Ourvoice',
    connectionURI: process.env.SUPERTOKENS_URI || 'http://localhost:3567',
    apiKey: process.env.SUPERTOKENS_API_KEY || 'super-secret-api-key',
    apiDomain:
      process.env.SUPERTOKENS_API_DOMAIN || 'http://authapi.ourvoice.test',
    apiBasePath: process.env.SUPERTOKENS_API_BASE_PATH || '/auth',
    websiteDomain:
      process.env.SUPERTOKENS_WEBSITE_DOMAIN || 'http://auth.ourvoice.test',
    websiteBasePath: process.env.SUPERTOKENS_WEBSITE_BASE_PATH || '/',
    cookieDomain: process.env.SUPERTOKENS_COOKIE_DOMAIN || '.ourvoice.test',
    adminEmail: process.env.SUPERTOKENS_ADMIN_EMAIL || 'admin@ourvoice.app',
    adminPassword: process.env.SUPERTOKENS_ADMIN_PASSWORD || 'super-admin-pass',
  },
  api: {
    url: process.env.VITE_APP_API_URL || 'http://api.ourvoice.test',
    port: parseInt(process.env.API_PORT, 10) || 3000,
  },
  app: {
    domain: process.env.VITE_APP_APP_DOMAIN || 'ourvoice.test',
    port: parseInt(process.env.APP_PORT, 10) || 3010,
  },
  authApi: {
    url: process.env.VITE_APP_AUTH_API_URL || 'http://authapi.ourvoice.test',
    port: parseInt(process.env.AUTH_API_PORT, 10) || 3001,
  },
  portal: {
    url: process.env.VITE_APP_PORTAL_URL || 'http://portal.ourvoice.test',
    port: parseInt(process.env.AUTH_API_PORT, 10) || 3011,
  },
  admin: {
    url: process.env.VITE_APP_ADMIN_URL || 'http://admin.ourvoice.test',
    port: parseInt(process.env.VITE_APP_ADMIN_PORT, 10) || 3020,
  },
  auth: {
    url: process.env.VITE_APP_AUTH_URL || 'http://auth.ourvoice.test',
    port: parseInt(process.env.VITE_APP_ADMIN_PORT, 10) || 3030,
  },
  smtp: {
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT, 10) || 2525,
    user: process.env.SMTP_USER || '63ab0b6f3cc683',
    password: process.env.SMTP_PASSWORD || 'c23816d29a6576',
  },
});
