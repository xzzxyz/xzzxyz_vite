import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue';


const routes = [{
  path: '/',
  redirect: '/tetris'
}]
// 自动导入 components 目录下的所有 Vue 文件
const modules = import.meta.glob('../components/*.vue');
for (const path in modules) {
  const page = modules[path];
  const componentName = path.match(/\.\/components\/(.*)\.vue$/)[1];
  const route = {
    path: `/${componentName.toLowerCase()}`,
    name: componentName,
    component: defineAsyncComponent(page)
  };
  routes.push(route);
}


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