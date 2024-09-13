import { createRouter, createWebHistory } from 'vue-router'

import config from '@/config'

import YamlContent from '../../../../config/config.yml'
import { DeploymentService } from '../utils/deployment.service'
import { ManageRedirectStateService } from '../utils/manage-redirect-state.service'
import EmailPasswordView from '../views/EmailPasswordView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import PasswordlessView from '../views/PasswordlessView.vue'
import VerifyChangeEmailView from '../views/VerifyChangeEmailView.vue'
import VerifyEmailView from '../views/VerifyEmailView.vue'
import VerifyView from '../views/VerifyView.vue'

const redirect: ManageRedirectStateService = new ManageRedirectStateService()
const deployment: DeploymentService = new DeploymentService()
// TODO: this list might be coming from the database later
const deploymentOrganisation = YamlContent.deployment as string

// const adminURL = import.meta.env.VITE_APP_ADMIN_URL
const domain = config.sessionTokenFrontendDomain

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
          console.log(to.query, ': ', deploymentOrganisation)
          deployment.set(`${to.query.d || deploymentOrganisation}`)
          redirect.set(`http://${to.query.d || deploymentOrganisation}${domain}/posts`)
          return { path: to.path, query: {}, hash: to.hash }
        }
      },
      props: route => ({ deployment: route.query.d || deploymentOrganisation }),
    },
    {
      path: '/signinWithEmailPassword',
      redirect: (to) => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/', query: to.query, hash: to.hash }
      },
    },
    {
      path: '/auth',
      redirect: (to) => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/', query: to.query }
      },
    },
    {
      path: '/signinWithoutPassword',
      name: 'passwordless',
      component: PasswordlessView,
      beforeEnter: (to) => {
        if (Object.keys(to.query).length) {
          // set deployment and redirect url
          deployment.set(`${to.query.d || deploymentOrganisation}`)
          redirect.set(`http://${to.query.d || deploymentOrganisation}${domain}/posts`)
          return { path: to.path, query: {}, hash: to.hash }
        }
      },
      props: route => ({ deployment: route.query.d || deploymentOrganisation }),
    },
    {
      path: '/magicLink',
      redirect: (to) => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/signinWithoutPassword', query: to.query, hash: to.hash }
      },
    },
    {
      path: '/passwordless',
      redirect: (to) => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/signinWithoutPassword', query: to.query, hash: to.hash }
      },
    },
    {
      path: '/signinWithEmailPassword',
      redirect: (to) => {
        // the function receives the target route as the argument
        // we return a redirect path/location here.
        return { path: '/auth', query: to.query, hash: to.hash }
      },
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: ForgotPasswordView,
    },
    {
      path: '/verify',
      name: 'verify',
      component: VerifyView,
    },
    {
      path: '/verify-email',
      name: 'verifyemail',
      component: VerifyEmailView,
    },
    {
      path: '/verify-change-email',
      name: 'verifychangeemail',
      component: VerifyChangeEmailView,
    },
    // default route
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
      // component: PageNotFound
    },
  ],
})

export default router
