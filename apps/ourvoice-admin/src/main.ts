import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SuperTokens from 'supertokens-web-js'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
import Session from 'supertokens-web-js/recipe/session'

import App from './App.vue'
import router from './router'

SuperTokens.init({
  appInfo: {
    apiDomain: 'http://localhost:3000',
    apiBasePath: '/auth',
    appName: '...'
  },
  recipeList: [Session.init(), EmailPassword.init()]
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
