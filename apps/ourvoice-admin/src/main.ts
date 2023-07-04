import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SuperTokens from 'supertokens-web-js'
import Session from 'supertokens-web-js/recipe/session'
import EmailVerification from 'supertokens-web-js/recipe/emailverification'

import config from './config'
import App from './App.vue'
import router from './router'

SuperTokens.init({
  appInfo: {
    appName: config.appName,
    apiDomain: config.apiDomain,
    apiBasePath: config.apiBasePath
  },
  recipeList: [
    Session.init({
      sessionTokenBackendDomain: config.sessionTokenBackendDomain,
      sessionTokenFrontendDomain: config.sessionTokenFrontendDomain
    }),
    EmailVerification.init()
  ]
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
