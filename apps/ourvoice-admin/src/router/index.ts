import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => HomeView
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => AuthView
    },
    {
      path: '/auth/reset-password',
      name: 'resetPassword',
      component: () => ForgotPasswordView
    }
  ]
})

export default router
