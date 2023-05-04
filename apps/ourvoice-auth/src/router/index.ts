import { createRouter, createWebHistory } from 'vue-router'
import VerifyView from '../views/VerifyView.vue'
import VerifyEmailView from '../views/VerifyEmailView.vue'
import EmailPasswordView from '../views/EmailPasswordView.vue'
import PasswordlessView from '../views/PasswordlessView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import { ManageRedirectStateService } from '../utils/manage-redirect-state.service'

const redirect: ManageRedirectStateService = new ManageRedirectStateService()
const adminURL = import.meta.env.VITE_APP_ADMIN_URL
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
      beforeEnter: () => {
        redirect.set(adminURL)
      },
      alias: ['/signinWithEmailPassword', '/auth']
    },
    {
      path: '/signinWithoutPassword',
      name: 'passwordless',
      component: PasswordlessView,
      // TODO: could use a url param here as well
      beforeEnter: (to) => {
        if (Object.keys(to.query).length) {
          redirect.set(`http://${to.query.d || 'demo'}${domain}`)
        } else {
          redirect.set(`http://demo${domain}`)
        }
        // return { path: to.path, query: {}, hash: to.hash }
      },
      alias: ['/magicLink', '/passwordless']
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
