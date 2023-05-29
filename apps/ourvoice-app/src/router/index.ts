import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PostsView from '../views/PostsView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import ModerationListView from '../views/ModerationListView.vue'
import ModerationView from '../views/ModerationView.vue'

import YamlContent from '../../../../config/config.yml'
import Session from 'supertokens-web-js/recipe/session'
import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'
import { useDeploymentStore } from '@/stores/deployment'

const deploymentDomain = import.meta.env.VITE_APP_FRONTEND_DOMAIN || 'localhost'
const portalURL = import.meta.env.VITE_APP_PORTAL_URL || 'http://localhost:3011'

const authBaseURL = import.meta.env.VITE_APP_AUTH_URL + '/signinWithoutPassword'
const authURL = `${authBaseURL}?d=${addDeployment().deployment}`

// TODO: this list might be coming from the database later
const deployment = YamlContent.deployment

function addDeployment() {
  const host = window.location.host
  const parts = host.split('.')
  return { deployment: parts[0] !== 'www' ? parts[0] : parts[1] }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: () => {
        return addDeployment()
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      props: () => {
        return addDeployment()
      }
    },
    {path: '/post',
      name: 'create-post',
      component: CreatePostView,
      props: () => {
        return addDeployment()
      }
    },
    {
      path: '/moderation/posts',
      name: 'moderate-post-list',
      component: ModerationListView,
      props: () => {
        return addDeployment()
      }
    },
    {
      path: '/moderation/post/:id',
      name: 'moderate-post',
      component: ModerationView,
    },
    {
      path: '/noauth/post',
      name: 'post',
      component: PostsView
    }
  ]
})

// Check if deployment exists, if not redirect to portal
// NOTE: this functionality is not used for MVP
// router.beforeEach((to, from, next) => {
//   const host = window.location.host
//   const parts = host.split('.')
//   // NOTE: set proper domain length (localhost has 2 parts)
//   const domainLength = deploymentDomain === 'localhost' ? 2 : 3
//   const deployment =
//     parts[0] !== 'www'
//       ? parts.length === domainLength
//         ? parts[0]
//         : false
//       : parts.length === domainLength
//       ? false
//       : parts[1]
//   // is deployment url in path and does it exist in deployments
//   if (deployment && deployments.indexOf(deployment) > -1) {
//     next()
//   } else window.location.replace(portalURL)
// })
const getDeployment = (host: string, deploymentDomain: string, deployments: string[]) => {
  const parts = host.split('.')
  // NOTE: set proper domain length (localhost has 2 parts)
  const domainLength = deploymentDomain === 'localhost' ? 2 : 3
  const deployment =
    parts[0] !== 'www'
      ? parts.length === domainLength
        ? parts[0]
        : false
      : parts.length === domainLength
      ? false
      : parts[1]
  return deployment && deployments.indexOf(deployment) > -1 ? deployment : false
}

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
  }
}

const redirectTo = (url: string) => {
  window.location.replace(url)
}

// Check if deployment exists, if not redirect to portal
router.beforeEach(async (to, from, next) => {
  const isDev = import.meta.env.DEV
  const host = window.location.host
  const deployment = getDeployment(host, deploymentDomain, deployments)

  // Save deployment in Pinia store
  const deploymentStore = useDeploymentStore()
  deploymentStore.deployment = deployment || ''

  if (!isDev && !deployment) {
    redirectTo(portalURL)
  }

  if (!(await checkForSession())) {
    redirectTo(authURL)
  }

  next()
})

export default router
