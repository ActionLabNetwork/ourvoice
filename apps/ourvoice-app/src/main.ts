import { apolloClient } from './graphql/client/index'
import { createApp, provide, h } from 'vue'
import { createHead } from '@unhead/vue'
import { createPinia } from 'pinia'
import SuperTokens from 'supertokens-web-js'
import Session from 'supertokens-web-js/recipe/session'
import EmailVerification from 'supertokens-web-js/recipe/emailverification'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { DefaultApolloClient } from '@vue/apollo-composable'
import config from './config'

// import VueVirtualScroller from 'vue-virtual-scroller'
// import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import AppFooter from './components/common/AppFooter.vue'
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
app.component('AppFooter', AppFooter)
// app.use(VueVirtualScroller)
app.mount('#app')
