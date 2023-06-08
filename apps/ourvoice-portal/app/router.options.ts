import type { RouterConfig } from '@nuxt/schema'
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  routes: (_routes) => [
    {
      name: 'index',
      path: '/:pathMatch(.*)*',
      component: () => import('~/pages/index.vue').then((r) => r.default || r),
    },
  ],
}
