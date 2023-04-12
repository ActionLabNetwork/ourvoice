import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SuperTokens from 'supertokens-web-js'
import Session from 'supertokens-web-js/recipe/session'
import EmailVerification from 'supertokens-web-js/recipe/emailverification'

import App from './App.vue'
import router from './router'

SuperTokens.init({
  appInfo: {
    appName: `${import.meta.env.VITE_APP_NAME || 'OurVoice Admin'}`,
    apiDomain: `${import.meta.env.VITE_APP_AUTH_API_URL || 'http://localhost:3001'}`,
    apiBasePath: `${import.meta.env.VITE_APP_AUTH_API_BASE_PATH || '/auth'}`
  },
  recipeList: [
    Session.init({
      sessionTokenBackendDomain: `${import.meta.env.VITE_APP_BACKEND_DOMAIN || '.localhost'}`,
      sessionTokenFrontendDomain: `${import.meta.env.VITE_APP_FRONTEND_DOMAIN || '.localhost'}`
    }),
    EmailVerification.init()
  ]
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
