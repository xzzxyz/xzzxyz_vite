import { createRouter, createWebHashHistory } from 'vue-router'

import HelloWorld from '@/components/HelloWorld.vue'

const router = createRouter({
  mode: 'history',
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HelloWorld,
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
