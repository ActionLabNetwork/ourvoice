import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import { createPinia } from 'pinia'
import SuperTokens from 'supertokens-web-js'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
import Passwordless from 'supertokens-web-js/recipe/passwordless'
import EmailVerification from 'supertokens-web-js/recipe/emailverification'
import Session from 'supertokens-web-js/recipe/session'

import App from './App.vue'
import router from './router'

SuperTokens.init({
  appInfo: {
    appName: `${import.meta.env.VITE_APP_NAME || 'OurVoice Auth'}`,
    apiDomain: `${import.meta.env.VITE_APP_AUTH_API_URL}`,
    apiBasePath: `${import.meta.env.VITE_APP_AUTH_API_BASE_PATH || '/auth'}`
  },
  recipeList: [
    EmailPassword.init(),
    Passwordless.init(),
    EmailVerification.init(),
    Session.init({
      sessionTokenBackendDomain: `${import.meta.env.VITE_APP_BACKEND_DOMAIN}`,
      sessionTokenFrontendDomain: `${import.meta.env.VITE_APP_FRONTEND_DOMAIN}`
    })
  ]
})

const app = createApp(App)

app.use(createPinia())
app.use(createHead())
app.use(router)

app.mount('#app')
