import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import { createPinia } from 'pinia'
import SuperTokens from 'supertokens-web-js'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
import Passwordless from 'supertokens-web-js/recipe/passwordless'
import EmailVerification from 'supertokens-web-js/recipe/emailverification'
import Session from 'supertokens-web-js/recipe/session'

import config from '@/config'
import App from './App.vue'
import router from './router'

SuperTokens.init({
  appInfo: {
    appName: config.appName,
    apiDomain: config.apiDomain,
    apiBasePath: config.apiBasePath
  },
  recipeList: [
    EmailPassword.init(),
    Passwordless.init(),
    EmailVerification.init(),
    Session.init({
      sessionTokenBackendDomain: config.sessionTokenBackendDomain,
      sessionTokenFrontendDomain: config.sessionTokenFrontendDomain
    })
  ]
})

const app = createApp(App)

app.use(createPinia())
app.use(createHead())
app.use(router)

app.mount('#app')
