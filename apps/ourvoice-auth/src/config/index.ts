export default {
  appName: `${import.meta.env.VITE_APP_NAME || 'OurVoice Admin'}`,
  apiDomain: `${import.meta.env.VITE_APP_AUTH_API_URL || 'http://authapi.ourvoice.test'}`,
  apiBasePath: `${import.meta.env.VITE_APP_AUTH_API_BASE_PATH || '/auth'}`,
  sessionTokenBackendDomain: `${import.meta.env.VITE_APP_BACKEND_DOMAIN || '.ourvoice.test'}`,
  sessionTokenFrontendDomain: `${import.meta.env.VITE_APP_FRONTEND_DOMAIN || '.ourvoice.test'}`,
  authURL: `${import.meta.env.VITE_APP_AUTH_URL || 'http://auth.ourvoice.test'}`,
  portalURL: `${import.meta.env.VITE_APP_PORTAL_URL || 'http://portal.ourvoice.test'}`,
  apiURL: `${import.meta.env.VITE_APP_API_URL || 'http://api.ourvoice.test'}`,
  appURL: `${import.meta.env.VITE_APP_APP_URL || 'http://demo.ourvoice.test'}`,
  adminURL: `${import.meta.env.VITE_APP_ADMIN_URL || 'http://admin.ourvoice.test'}`,
  appDomain: `${import.meta.env.VITE_APP_APP_DOMAIN || 'ourvoice.test'}`,
}
