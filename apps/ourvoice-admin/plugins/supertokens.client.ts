import SuperTokens from 'supertokens-web-js'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
import Session from 'supertokens-web-js/recipe/session'

export default defineNuxtPlugin(() => {
  SuperTokens.init({
    appInfo: {
      apiDomain: 'http://localhost:3000',
      apiBasePath: '/auth',
      appName: '...',
    },
    recipeList: [Session.init(), EmailPassword.init()],
  })
})
