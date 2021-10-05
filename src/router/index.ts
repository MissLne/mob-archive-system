import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/description',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: 'description',
        name: 'description',
        component: () => import('@/views/principal/Description.vue')
      },
      {
        path: 'apply',
        name: 'apply',
        component: () => import('@/views/principal/Apply.vue')
      },
      {
        path: 'me',
        name: 'me',
        component: () => import('@/views/principal/Me.vue')
      }
    ]
  },
  {
    path: '/editApply',
    name: 'editApply',
    component: () => import('@/views/other/applyPage/edit-apply.vue'),
  },
  {
    path: '/addApply',
    name: 'addApply',
    component: () => import('@/views/other/applyPage/add-apply.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/collect-files',
    name: 'collect',
    redirect: '/collect-files/list',
    component: () => import('@/views/temp-arch/TempArch.vue'),
    children: [
      {
        path: 'list',
        name: 'collect-list',
        component: () => import('@/views/temp-arch/TempArchList.vue')
      },
      {
        path: 'detail',
        name: 'collect-detail',
        component: () => import('@/views/temp-arch/TempArchDetail.vue')
      }
    ]
  },
  {
    path: '/myDes',
    name: 'myDes',
    component: () => import('@/views/other/desPage/myDes.vue'),
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
