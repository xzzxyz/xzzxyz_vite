import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue';
import $ from 'jquery';


const routes = [{
  path: '/',
  redirect: '/tetris'
}]
// 自动导入 components 目录下的所有 Vue 文件
const modules = import.meta.glob('../pages/*/index.vue');
$.each(modules, (path, page) => {
  const pageName = path.match(/\.\/pages\/(.*)\/index\.vue$/)[1];
  const route = {
    path: `/${pageName.toLowerCase()}`,
    name: pageName,
    component: defineAsyncComponent(page)
  };
  routes.push(route);
})


const router = createRouter({
  mode: 'history',
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  // 匹配不到路由时，回到之前页面
  if (!routes.some(route => route?.path === to?.path)) {
    return false
  }
})

export default router