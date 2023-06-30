import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Session from 'supertokens-web-js/recipe/session'
import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'
import { UserRoleClaim /*PermissionClaim*/ } from 'supertokens-web-js/recipe/userroles'

import config from '@/config'

const authURL = `${config.authURL}/auth`
const portalURL = config.portalURL

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

const checkForSession = async () => {
  if (!(await Session.doesSessionExist())) return false
  const validationErrors = await Session.validateClaims()
  if (validationErrors.length === 0) {
    return true
  } else {
    for (const err of validationErrors) {
      if (err.validatorId === EmailVerificationClaim.id) {
        return false
      }
    }
    // other error
    return false
  }
}

const redirectTo = (url: string) => {
  window.location.replace(url)
}

// Check deployment and session
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    const hasSession = await checkForSession()
    if (hasSession) {
      if (to.matched.some((record: any) => record.meta.requiresAdmin)) {
        const validationErrors = await Session.validateClaims({
          overrideGlobalClaimValidators: (globalValidators) => [
            ...globalValidators,
            UserRoleClaim.validators.includesAny(['admin', 'super'])
            // UserRoleClaim.validators.includes('super')
            /* PermissionClaim.validators.includes("modify") */
          ]
        })

        if (validationErrors.length === 0) {
          next()
        }

        for (const err of validationErrors) {
          if (err.validatorId === UserRoleClaim.id) {
            // user roles claim check failed
            // not admin or not moderator
            redirectTo(portalURL)
          } else {
            // some other claim check failed (from the global validators list)
            // not verified for example
            // redirect to auth
            redirectTo(authURL)
          }
        }
      }
    } else {
      // redirect to auth
      redirectTo(authURL)
    }
  } else {
    next()
  }
})

export default router
