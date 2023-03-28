import { createApp } from 'vue'
import { createPinia } from 'pinia'
import SuperTokens from 'supertokens-web-js'
import Session from 'supertokens-web-js/recipe/session'
import EmailVerification from 'supertokens-web-js/recipe/emailverification'

import App from './App.vue'
import router from './router'

const apiPort = import.meta.env.VITE_APP_API_PORT || 3000
const apiDomain = import.meta.env.VITE_APP_API_URL || `http://localhost:${apiPort}`

SuperTokens.init({
  appInfo: {
    apiDomain: apiDomain,
    apiBasePath: '/auth',
    appName: 'OurVoice'
  },
  recipeList: [Session.init({ sessionTokenFrontendDomain: '.localhost' }), EmailVerification.init()]
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
