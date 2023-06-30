import { apolloClient } from './graphql/client/index'
import { createApp, provide, h } from 'vue'
import { createHead } from '@unhead/vue'
import { createPinia } from 'pinia'
import SuperTokens from 'supertokens-web-js'
import Session from 'supertokens-web-js/recipe/session'
import EmailVerification from 'supertokens-web-js/recipe/emailverification'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { DefaultApolloClient } from '@vue/apollo-composable'

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
  // enableDebugLogs: true
})

// Set up fontawesome
library.add(fas)

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
})

app.use(createPinia())
app.use(createHead())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
