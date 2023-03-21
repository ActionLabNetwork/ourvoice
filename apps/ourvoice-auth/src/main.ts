import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SuperTokens from 'supertokens-web-js'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
import Passwordless from 'supertokens-web-js/recipe/passwordless'
import Session from 'supertokens-web-js/recipe/session'

import App from './App.vue'
import router from './router'

SuperTokens.init({
  appInfo: {
    apiDomain: 'http://localhost:3000',
    apiBasePath: '/auth',
    appName: 'OurVoice'
  },
  recipeList: [
    EmailPassword.init(),
    Passwordless.init(),
    Session.init({ sessionTokenFrontendDomain: '.localhost' })
  ]
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
