import Session from 'supertokens-web-js/recipe/session'
import { createRouter, createWebHistory } from 'vue-router'

import config from '@/config'
// import YamlContent from '../../../../config/config.yml'
import { useDeploymentStore } from '@/stores/deployment'

import {
  checkDeployment,
  checkForSession,
  getCurrentDeploymentDomain,
  redirectTo,
} from '../services/session.service'
import { useUserStore } from './../stores/user'

// const deploymentDomain = import.meta.env.VITE_APP_FRONTEND_DOMAIN || 'localhost'
// const portalURL = import.meta.env.VITE_APP_PORTAL_URL || 'http://localhost:3011'
const HomeView = () => import('../views/HomeView.vue')
const AboutView = () => import('../views/AboutView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const PostsView = () => import('../views/PostsView.vue')
const NoticeView = () => import('../views/NoticeView.vue')
const PostPage = () => import('../views/PostPage.vue')
const CreatePostView = () => import('../views/CreatePostView.vue')
function PostModerationListView() {
  return import('../views/PostModerationListView.vue')
}
const PostModerationView = () => import('../views/PostModerationView.vue')
function CommentModerationListView() {
  return import('../views/CommentModerationListView.vue')
}
const CommentModerationView = () => import('../views/CommentModerationView.vue')
const PollView = () => import('../views/PollView.vue')
const PollModerationView = () => import('../views/PollModerationView.vue')
const LongConsentView = () => import('../views/LongConsentView.vue')

const authBaseURL = config.authURL
const authURL = `${authBaseURL}/signinWithoutPassword?d=${
  getCurrentDeploymentDomain().deployment
}`
const authModURL = `${authBaseURL}?d=${getCurrentDeploymentDomain().deployment}`

// TODO: this list might be coming from the database later
// const deployments = YamlContent.deployment

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, left: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false },
      props: () => {
        return getCurrentDeploymentDomain()
      },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: false },
      props: () => {
        return getCurrentDeploymentDomain()
      },
    },
    {
      path: '/notice',
      name: 'notice',
      component: NoticeView,
      meta: { requiresAuth: true },
      props: () => {
        return getCurrentDeploymentDomain()
      },
    },
    {
      path: '/consent',
      name: 'consent',
      component: LongConsentView,
      meta: { requiresAuth: true },
      props: () => {
        return getCurrentDeploymentDomain()
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/post',
      name: 'create-post',
      component: CreatePostView,
      meta: { requiresAuth: true, navBarSwitchState: 'post' },
    },
    {
      path: '/polls',
      name: 'polls',
      component: PollView,
      meta: { requiresAuth: true, navBarSwitchState: 'polls' },
    },
    {
      path: '/moderation/polls',
      name: 'moderation-polls-list',
      component: PollModerationView,
      meta: {
        requiresAuth: true,
        requiresModeration: true,
        navBarSwitchState: 'polls',
      },
    },
    {
      path: '/moderation/posts',
      name: 'moderate-post-list',
      component: PostModerationListView,
      meta: {
        requiresAuth: true,
        requiresModerator: true,
        navBarSwitchState: 'post',
      },
    },
    {
      path: '/moderation/post/:id',
      name: 'moderate-post',
      component: PostModerationView,
      meta: {
        requiresAuth: true,
        requiresModerator: true,
        navBarSwitchState: 'post',
      },
    },
    {
      path: '/moderation/comments',
      name: 'moderate-comment-list',
      component: CommentModerationListView,
      meta: {
        requiresAuth: true,
        requiresModerator: true,
        navBarSwitchState: 'post',
      },
    },
    {
      path: '/moderation/comment/:id',
      name: 'moderate-comment',
      component: CommentModerationView,
      meta: {
        requiresAuth: true,
        requiresModerator: true,
        navBarSwitchState: 'post',
      },
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostsView,
      meta: { requiresAuth: true, navBarSwitchState: 'post' },
    },
    {
      path: '/posts/:id(\\d+)',
      name: 'postpage',
      component: PostPage,
      meta: { requiresAuth: true, navBarSwitchState: 'post' },
    },
  ],
})

// Check deployment and session
router.beforeEach(async (to, from, next) => {
  // const host = window.location.host
  // const deployment = getDeployment(host, deploymentDomain, deployments)

  // Save current page deployment in Pinia store
  const deployment = getCurrentDeploymentDomain().deployment
  const deploymentStore = useDeploymentStore()
  deploymentStore.deployment = deployment || ''

  // use user store
  const userStore = useUserStore()
  // check for user session
  const isSession = await checkForSession()

  if (isSession) {
    // if current deployment matches with user then init user store
    if (await checkDeployment(deployment)) {
      await Session.attemptRefreshingSession()
      // update user state
      await userStore.verifyUserSession()
    }
  }

  // check if route requires authentication
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    // check if session exists and valid
    if (isSession) {
      // if current deployment matches with user then init user store
      if (await checkDeployment(deployment)) {
        if (to.matched.some((record: any) => record.meta.requiresModerator)) {
          if (userStore.isModerator || userStore.isAdmin || userStore.isSuperAdmin) {
            next()
          }
          else {
            redirectTo('/')
          }
        }
        else {
          next()
        }
      }
      else {
        if (to.name !== 'notice') {
          next({ name: 'notice' })
        }
        else {
          next()
        }
      }
    }
    else {
      // check if route requires moderator role
      if (to.matched.some((record: any) => record.meta.requiresModerator)) {
        redirectTo(authModURL)
      }
      else {
        redirectTo(authURL)
      }
    }
  }
  else {
    next()
  }
})

export default router
