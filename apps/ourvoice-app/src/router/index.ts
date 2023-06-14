import { useUserStore } from './../stores/user'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PostsView from '../views/PostsView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import CreateCommentView from '../views/CreateCommentView.vue'
import PostModerationListView from '../views/PostModerationListView.vue'
import PostModerationView from '../views/PostModerationView.vue'
import CommentModerationListView from '../views/CommentModerationListView.vue'
import CommentModerationView from '../views/CommentModerationView.vue'

// import YamlContent from '../../../../config/config.yml'
import Session from 'supertokens-web-js/recipe/session'
import { EmailVerificationClaim } from 'supertokens-web-js/recipe/emailverification'
import { useDeploymentStore } from '@/stores/deployment'

// const deploymentDomain = import.meta.env.VITE_APP_FRONTEND_DOMAIN || 'localhost'
// const portalURL = import.meta.env.VITE_APP_PORTAL_URL || 'http://localhost:3011'

const authBaseURL = import.meta.env.VITE_APP_AUTH_URL + '/signinWithoutPassword'
const authURL = `${authBaseURL}?d=${addDeployment().deployment}`

// TODO: this list might be coming from the database later
// const deployments = YamlContent.deployment

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
      meta: { requiresAuth: false },
      props: () => {
        return addDeployment()
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: true },
      props: () => {
        return addDeployment()
      }
    },
    {
      path: '/post',
      name: 'create-post',
      component: CreatePostView,
      meta: { requiresAuth: true }
    },
    {
      path: '/comment',
      name: 'create-comment',
      component: CreateCommentView,
      meta: { requiresAuth: true }
    },
    {
      path: '/moderation/posts',
      name: 'moderate-post-list',
      component: PostModerationListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/moderation/post/:id',
      name: 'moderate-post',
      component: PostModerationView,
      meta: { requiresAuth: true }
    },
    {
      path: '/moderation/comments',
      name: 'moderate-comment-list',
      component: CommentModerationListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/moderation/comment/:id',
      name: 'moderate-comment',
      component: CommentModerationView,
      meta: { requiresAuth: true }
    },
    {
      path: '/noauth/post',
      name: 'post',
      component: PostsView,
      meta: { requiresAuth: false }
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
// const getDeployment = (host: string, deploymentDomain: string, deployments: string[]) => {
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
//   return deployment && deployments.indexOf(deployment) > -1 ? deployment : false
// }

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
const checkDeployment = async (deployment: string): Promise<boolean> => {
  const payload = await Session.getAccessTokenPayloadSecurely()
  const userDeployment = payload.deployment || ''
  console.log(userDeployment)
  return userDeployment === deployment || userDeployment === '*'
}

const initUserStore = async () => {
  // Init user store
  const userStore = useUserStore()
  // TODO: userstore should use supertokens session functionality rather than making requests to API
  // needs rewriting a bit
  await userStore.verifyUserSession()
}

const redirectTo = (url: string) => {
  window.location.replace(url)
}

// Check deployment and session
router.beforeEach(async (to, from, next) => {
  // const host = window.location.host
  // const deployment = getDeployment(host, deploymentDomain, deployments)
  const deployment = addDeployment().deployment

  // Save current page deployment in Pinia store
  const deploymentStore = useDeploymentStore()
  deploymentStore.deployment = deployment || ''

  // check for user session
  const isSession = await checkForSession()

  if (isSession) {
    // if deployment matches and init user store
    if (await checkDeployment(deployment)) {
      initUserStore()
    }
  }

  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    if (isSession) {
      if (await checkDeployment(deployment)) {
        next()
      } else {
        // TODO: handle wrong deployment
        console.log('WRONG DEPLOYMENT NOTICE')
        next()
      }
    } else {
      redirectTo(authURL)
    }
  } else {
    next()
  }
})

export default router
