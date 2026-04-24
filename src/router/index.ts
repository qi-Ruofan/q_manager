import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: 'home',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

router.beforeEach((to, from, next) => {
  // 判断用户是否有 token（是否已经登录）
  if (localStorage.getItem('access_token')) {
    next() // 如果有 token，允许访问目标路由
  } else {
    if (to.name !== 'Login') {
      // 如果目标路由不是登录页
      next({ name: 'Login' }) // 重定向到登录页
    } else {
      next() // 如果目标路由是登录页，允许访问
    }
  }
})

export default router
