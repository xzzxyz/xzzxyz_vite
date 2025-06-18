import { createRouter, createWebHashHistory } from 'vue-router'

import gomoku from '@/components/gomoku.vue'
import trafficLight from '@/components/trafficLight.vue'

const router = createRouter({
  mode: 'history',
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: gomoku,
      // component: trafficLight,
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login
    // },
    {
      path: '/refresh',
      name: 'refresh',
      // component: Login
    }
  ]
})

export default router
