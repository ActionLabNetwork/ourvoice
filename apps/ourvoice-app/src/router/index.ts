import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NoAuthView from '../views/NoAuthView.vue'

// TODO: this list needs to come from the database
const deployments = ['demo']

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

//TODO: Check if deployment exists, if not redirect to portal
router.beforeEach((to, from, next) => {
  const host = window.location.host
  const parts = host.split('.')
  // TODO: set proper domain length (localhost has 2 parts)
  const deployment =
    parts[0] !== 'www'
      ? parts.length === 2
        ? parts[0]
        : false
      : parts.length === 2
      ? false
      : parts[1]
  // is deployment url in path and does it exist in deployments
  if (deployment && deployments.indexOf(deployment) > -1) {
    next()
  } else window.location.replace('http://localhost:3011')
})

export default router
