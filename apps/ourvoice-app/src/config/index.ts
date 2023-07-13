export default {
  appName: `${import.meta.env.VITE_APP_NAME || 'OurVoice'}`,
  apiDomain: `${import.meta.env.VITE_APP_AUTH_API_URL || 'http://authapi.ourvoice.test'}`,
  apiBasePath: `${import.meta.env.VITE_APP_AUTH_API_BASE_PATH || '/auth'}`,
  sessionTokenBackendDomain: `${import.meta.env.VITE_APP_BACKEND_DOMAIN || '.ourvoice.test'}`,
  sessionTokenFrontendDomain: `${import.meta.env.VITE_APP_FRONTEND_DOMAIN || '.ourvoice.test'}`,
  authURL: `${import.meta.env.VITE_APP_AUTH_URL || 'http://auth.ourvoice.test'}`,
  portalURL: `${import.meta.env.VITE_APP_PORTAL_URL || 'http://portal.ourvoice.test'}`,
  apiURL: `${import.meta.env.VITE_APP_API_URL || 'http://api.ourvoice.test'}`,
  adminEmail: `${import.meta.env.VITE_APP_ADMIN_EMAIL || 'admin@ourvoice.app'}`,
  sessionEndpoint: `${import.meta.env.VITE_SESSION_INFO_ENDPOINT || '/sessioninfo'}`,
  globalPepper: `${'Are7pNzysGMRjfgF4eKhp8sHtgCFF9Cjft6ut9RVLcdSZPVkYU46xfb9Eqjwft2zkUP9KBGDkg3UpnCfh8C3zhCsKDDxa5u8xUyC43cQM4cwRw7TpMnb5KYRbuGQwnGfWf28Kf3HPhBuzf7ujzZzVvkTrk2h9NjwN8Kpe8aZfd8HuYHwqVscG8WdbdDwGFhH9G8cbqBVaQAQd5GBzSKRwwV5WdLWX2CEqm2FRtYBYz3W9Yq6yG7R4RwWBvWcmqCE'}`,
  appURL: `${import.meta.env.VITE_APP_APP_URL || 'http://demo.ourvoice.test'}`,
  adminURL: `${import.meta.env.VITE_APP_ADMIN_URL || 'http://admin.ourvoice.test'}`,
  appDomain: `${import.meta.env.VITE_APP_APP_DOMAIN || 'ourvoice.test'}`
}
