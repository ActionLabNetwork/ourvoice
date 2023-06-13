import { useUserStore } from './../stores/user'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PostsView from '../views/PostsView.vue'
import TestView from '@/views/TestView.vue'
import NoticeView from '../views/NoticeView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import CreateCommentView from '../views/CreateCommentView.vue'
import PostModerationListView from '../views/PostModerationListView.vue'
import PostModerationView from '../views/PostModerationView.vue'
import CommentModerationListView from '../views/CommentModerationListView.vue'
import CommentModerationView from '../views/CommentModerationView.vue'
import {
  getCurrentDeploymentDomain,
  checkForSession,
  checkDeployment,
  redirectTo,
  getSessionPayload
} from '../services/session.service'

// import YamlContent from '../../../../config/config.yml'
import { useDeploymentStore } from '@/stores/deployment'

// const deploymentDomain = import.meta.env.VITE_APP_FRONTEND_DOMAIN || 'localhost'
// const portalURL = import.meta.env.VITE_APP_PORTAL_URL || 'http://localhost:3011'

const authBaseURL = import.meta.env.VITE_APP_AUTH_URL
const authURL = `${authBaseURL}/signinWithoutPassword?d=${getCurrentDeploymentDomain().deployment}`
const authModURL = `${authBaseURL}?d=${getCurrentDeploymentDomain().deployment}`

// TODO: this list might be coming from the database later
// const deployments = YamlContent.deployment

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false },
      props: () => {
        return getCurrentDeploymentDomain()
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: false },
      props: () => {
        return getCurrentDeploymentDomain()
      }
    },
    {
      path: '/notice',
      name: 'notice',
      component: NoticeView,
      meta: { requiresAuth: true },
      props: () => {
        return getCurrentDeploymentDomain()
      }
    },
    {
      path: '/post',
      name: 'create-post',
      component: CreatePostView
      meta: { requiresAuth: true }
    },
    {
      path: '/comment',
      name: 'create-comment',
      component: CreateCommentView
      meta: { requiresAuth: true }
    },
    {
      path: '/moderation/posts',
      name: 'moderate-post-list',
      component: PostModerationListView,
      meta: { requiresAuth: true, requiresModerator: true }
    },
    {
      path: '/moderation/post/:id',
      name: 'moderate-post',
      component: PostModerationView,
      meta: { requiresAuth: true, requiresModerator: true }
    },
    {
      path: '/moderation/comments',
      name: 'moderate-comment-list',
      component: CommentModerationListView,
      meta: { requiresAuth: true, requiresModerator: true }
    },
    {
      path: '/moderation/comment/:id',
      name: 'moderate-comment',
      component: CommentModerationView,
      meta: { requiresAuth: true, requiresModerator: true }
    },
    {
      path: '/post',
      name: 'post',
      component: PostsView,
      meta: { requiresAuth: false }
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    },
    {
      path: '/post/:id',
      component: () => import('@/components/post/PostPage.vue')
    }
  ]
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
          userStore.isModerator ? next() : redirectTo('/')
        } else {
          next()
        }
      } else {
        to.name !== 'notice' ? next({ name: 'notice' }) : next()
      }
    } else {
      // check if route requires moderator role
      to.matched.some((record: any) => record.meta.requiresModerator)
        ? redirectTo(authModURL)
        : redirectTo(authURL)
    }
  } else {
    next()
  }
})

export default router
