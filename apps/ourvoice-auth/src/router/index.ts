import { createRouter, createWebHistory } from 'vue-router'
import VerifyView from '../views/VerifyView.vue'
import VerifyEmailView from '../views/VerifyEmailView.vue'
import EmailPasswordView from '../views/EmailPasswordView.vue'
import PasswordlessView from '../views/PasswordlessView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import { ManageRedirectStateService } from '../utils/manage-redirect-state.service'
import { DeploymentService } from '../utils/deployment.service'

const redirect: ManageRedirectStateService = new ManageRedirectStateService()
const deployment: DeploymentService = new DeploymentService()

// const adminURL = import.meta.env.VITE_APP_ADMIN_URL
const domain = import.meta.env.VITE_APP_FRONTEND_DOMAIN

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // NOTE: one view style login (remove)
    // {
    //   path: '/',
    //   name: 'auth',
    //   component: AuthView,
    //   // TODO: might want to use a query parameter for this
    //   beforeEnter: (to) => {
    //     if (to.redirectedFrom?.name === 'passwordless') {
    //       redirect.set(appURL)
    //     } else {
    //       redirect.set(adminURL)
    //     }
    //   },
    //   props: (route) => {
    //     return { mode: route.redirectedFrom?.name || 'emailpassword' }
    //   }
    // },
    // {
    //   path: '/signinWithoutPassword',
    //   name: 'passwordless',
    //   redirect: '/'
    // },
    // {
    //   path: '/signinWithEmailPassword',
    //   name: 'emailpassword',
    //   beforeEnter: () => {
    //     redirect.set(adminURL)
    //   },
    //   redirect: '/'
    // },
    {
      path: '/',
      name: 'emailpassword',
      component: EmailPasswordView,
      // TODO: could use a url param here as well
      beforeEnter: (to) => {
        if (Object.keys(to.query).length) {
          // set deployment and redirect url
          deployment.set(`${to.query.d || 'demo'}`)
          redirect.set(`http://${to.query.d || 'demo'}${domain}`)
          return { path: to.path, query: {}, hash: to.hash }
        }
      },
      props: (route) => ({ deployment: route.query.d || 'demo' })
    },
    {
      path: '/signinWithEmailPassword',
      redirect: (to) => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/', query: to.query }
      }
    },
    {
      path: '/auth',
      redirect: (to) => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/', query: to.query }
      }
    },
    {
      path: '/signinWithoutPassword',
      name: 'passwordless',
      component: PasswordlessView,
      beforeEnter: (to) => {
        if (Object.keys(to.query).length) {
          // set deployment and redirect url
          deployment.set(`${to.query.d || 'demo'}`)
          redirect.set(`http://${to.query.d || 'demo'}${domain}`)
          return { path: to.path, query: {}, hash: to.hash }
        }
      },
      props: (route) => ({ deployment: route.query.d || 'demo' })
    },
    {
      path: '/magicLink',
      redirect: (to) => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/signinWithoutPassword', query: to.query }
      }
    },
    {
      path: '/passwordless',
      redirect: (to) => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/signinWithoutPassword', query: to.query }
      }
    },
    {
      path: '/signinWithEmailPassword',
      redirect: (to) => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/auth', query: to.query }
      }
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: ForgotPasswordView
    },
    {
      path: '/verify',
      name: 'verify',
      component: VerifyView
    },
    {
      path: '/verify-email',
      name: 'verifyemail',
      component: VerifyEmailView
    },
    // default route
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
      // component: PageNotFound
    }
  ]
})

export default router
