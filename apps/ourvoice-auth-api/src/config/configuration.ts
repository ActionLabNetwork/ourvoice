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
    olderCookieDomain: process.env.SUPERTOKENS_OLDER_COOKIE_DOMAIN || 'old.ourvoice.test',
    adminEmail: process.env.SUPERTOKENS_ADMIN_EMAIL || 'admin@ourvoice.app',
    adminPassword: process.env.SUPERTOKENS_ADMIN_PASSWORD || 'super-admin-pass',
  },
  api: {
    url: process.env.VITE_APP_API_URL || 'http://api.ourvoice.test',
    port: Number.parseInt(process.env.API_PORT, 10) || 3000,
  },
  app: {
    domain: process.env.VITE_APP_APP_DOMAIN || 'ourvoice.test',
    port: Number.parseInt(process.env.APP_PORT, 10) || 3010,
  },
  authApi: {
    url: process.env.VITE_APP_AUTH_API_URL || 'http://authapi.ourvoice.test',
    port: Number.parseInt(process.env.AUTH_API_PORT, 10) || 3001,
  },
  portal: {
    url: process.env.VITE_APP_PORTAL_URL || 'http://portal.ourvoice.test',
    port: Number.parseInt(process.env.AUTH_API_PORT, 10) || 3011,
  },
  admin: {
    url: process.env.VITE_APP_ADMIN_URL || 'http://admin.ourvoice.test',
    port: Number.parseInt(process.env.VITE_APP_ADMIN_PORT, 10) || 3020,
  },
  auth: {
    url: process.env.VITE_APP_AUTH_URL || 'http://auth.ourvoice.test',
    port: Number.parseInt(process.env.VITE_APP_ADMIN_PORT, 10) || 3030,
  },
  smtp: {
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: Number.parseInt(process.env.SMTP_PORT, 10) || 2525,
    user: process.env.SMTP_USER || '63ab0b6f3cc683',
    password: process.env.SMTP_PASSWORD || 'c23816d29a6576',
  },
  contact: {
    recaptchaSecret:
      process.env.CONTACT_FORM_RECAPTCHA_SECRET || 'sandbox.smtp.mailtrap.io',
    database: {
      host: process.env.DATABASE_CONTACT_FORM_HOST || '127.0.0.1',
      port: Number.parseInt(process.env.DATABASE_CONTACT_FORM_PORT, 10) || 27017,
      name: process.env.DATABASE_CONTACT_FORM_NAME || 'contactform',
      url:
        process.env.DATABASE_CONTACT_FORM_URL
        || 'mongodb://127.0.0.1:27017/contactform?authSource=admin&directConnection=true',
    },
  },
  database: {
    user: process.env.POSTGRES_USER || 'your_db_user',
    password: process.env.POSTGRES_PASSWORD || 'your_db_password',
    host: process.env.POSTGRES_DB_HOST || '127.0.0.1',
    port: Number.parseInt(process.env.POSTGRES_DB_PORT, 10) || 5433,
    db: process.env.POSTGRES_DB || 'ourvoice_db',
    hostTest: process.env.POSTGRES_DB_TEST_HOST || '127.0.0.1',
    portTest: Number.parseInt(process.env.POSTGRES_DB_TEST_PORT, 10) || 5436,
    dbTest: process.env.POSTGRES_DB_TEST || 'ourvoice_db_test',
    hostPre: process.env.POSTGRES_DB_MODERATION_HOST || '127.0.0.1',
    portPre: Number.parseInt(process.env.POSTGRES_DB_MODERATION_PORT, 10) || 5435,
    dbPre: process.env.POSTGRES_DB_MODERATION || 'ourvoice_db_mod',
    hostPreTest: process.env.POSTGRES_DB_MODERATION_TEST_HOST || '127.0.0.1',
    portPreTest:
      Number.parseInt(process.env.POSTGRES_DB_MODERATION_TEST_PORT, 10) || 5437,
    dbPreTest:
      process.env.POSTGRES_DB_MODERATION_TEST || 'ourvoice_db_mod_test',
    mainUrl:
      process.env.DATABASE_MAIN_URL
      || 'postgresql://your_db_user:your_db_password@127.0.0.1:5433/ourvoice_db?schema=ourvoice&sslmode=prefer',
    moderationUrl:
      process.env.DATABASE_MODERATION_URL
      || 'postgresql://your_db_user:your_db_password@127.0.0.1:5435/ourvoice_db_mod?schema=ourvoice&sslmode=prefer',
    mainTestUrl:
      process.env.DATABASE_MAIN_TEST_URL
      || 'postgresql://your_db_user:your_db_password@127.0.0.1:5436/ourvoice_db_test',
    moderationTestUrl:
      process.env.DATABASE_MODERATION_TEST_URL
      || 'postgresql://your_db_user:your_db_password@127.0.0.1:5437/ourvoice_db_mod_test',
  },
})
