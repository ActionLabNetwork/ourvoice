import { apolloClient } from './graphql/client/index'
import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import SuperTokens from 'supertokens-web-js'
import Session from 'supertokens-web-js/recipe/session'
import EmailVerification from 'supertokens-web-js/recipe/emailverification'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeading, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { DefaultApolloClient } from '@vue/apollo-composable'

import App from './App.vue'
import router from './router'

SuperTokens.init({
  appInfo: {
    appName: `${import.meta.env.VITE_APP_NAME || 'OurVoice APP'}`,
    apiDomain: `${import.meta.env.VITE_APP_AUTH_API_URL}`,
    apiBasePath: `${import.meta.env.VITE_APP_AUTH_API_BASE || '/auth'}`
  },
  recipeList: [
    Session.init({
      sessionTokenBackendDomain: `${import.meta.env.VITE_APP_BACKEND_DOMAIN}`,
      sessionTokenFrontendDomain: `${import.meta.env.VITE_APP_FRONTEND_DOMAIN}`
    }),
    EmailVerification.init()
  ]
  // enableDebugLogs: true
})

// Set up fontawesome
library.add(faHeading, faPaperclip)

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
})

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
