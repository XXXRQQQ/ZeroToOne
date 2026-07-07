// 路由配置
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/index.vue'),
    meta: { title: '从零到一数据大屏' },
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/demo/index.vue'),
    meta: { title: '演示大屏' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫 - 设置页面标题
router.beforeEach((to) => {
  const title = to.meta?.title as string
  if (title) {
    document.title = title
  }
})

export default router
