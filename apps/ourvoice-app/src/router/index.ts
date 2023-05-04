import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NoAuthView from '../views/NoAuthView.vue'

import YamlContent from '../../../../config/config.yml'

const deploymentDomain = import.meta.env.VITE_APP_FRONTEND_DOMAIN || 'localhost'
const portalURL = import.meta.env.VITE_APP_PORTAL_URL || 'http://localhost:3011'

// TODO: this list might be coming from the database later
const deployments = YamlContent.deployments

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
    }
  ]
})

// Check if deployment exists, if not redirect to portal
router.beforeEach((to, from, next) => {
  const host = window.location.host
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
  // is deployment url in path and does it exist in deployments
  if (deployment && deployments.indexOf(deployment) > -1) {
    next()
  } else window.location.replace(portalURL)
})

export default router
