import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NoAuthView from '../views/NoAuthView.vue'
import PostsView from '../views/PostsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/noauth',
      name: 'noauth',
      component: NoAuthView
    },
    {
      path: '/noauth/post',
      name: 'post',
      component: PostsView,
    }
  ]
})

export default router
