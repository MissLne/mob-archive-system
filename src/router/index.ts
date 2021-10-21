import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { component } from 'vue/types/umd'

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
    component: () => import('@/views/collect-files/CollectFiles.vue'),
    children: [
      {
        path: '/',
        name: 'collectFilesUpload',
        component: () => import('@/views/collect-files/CollectFilesUpload.vue'),
      },
      {
        path: 'detail',
        name: 'collectFilesDetail',
        component: () => import('@/views/collect-files/CollectFilesDetail.vue'),
      },
      {
        path: 'face-recognition',
        name: 'faceRecognition',
        component: () => import('@/views/face-recognition/FaceRecognition.vue'),
      }
    ]
  },
  {
    path: '/temp-arch',
    component: () => import('@/views/temp-arch/TempArch.vue'),
    children: [
      {
        path: '/',
        name: 'tempArchUpload',
        component: () => import('@/views/temp-arch/TempArchUpload.vue'),
      },
      {
        path: 'detail/x',
        name: 'tempArchDetail',
        component: () => import('@/views/temp-arch/TempArchDetail.vue'),
        props: true
      },
      {
        path: 'detail/meta-data/x',
        name: 'tempArchMetaData',
        component: () => import('@/views/meta-data/MetaData.vue'),
      },
    ]
  },
  {
    path: '/arch',
    redirect: '/arch/detail',
    component: () => import('@/views/other/archDetail/Arch.vue'),
    children: [
      {
        path: 'my-des',
        name: 'myDes',
        component: () => import('@/views/other/archDetail/MyDes.vue'),
      },
      {
        path: 'detail',
        name: 'archDetail',
        component: () => import('@/views/other/archDetail/ArchDetail.vue'),
      },
      {
        path: 'meta-data',
        name: 'archMetaData',
        component: () => import('@/views/meta-data/MetaData.vue'),
      },
    ]
  }, 
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    // return { x: 0, y: 0 }
    return savedPosition
  }
})

router.beforeEach((to, from, next) => {
  // console.log(to, from, next);
  if (to.name === 'login'
    || to.name?.includes('collectFiles')
    || localStorage.getItem('token')
  )
    next();
  else
    next({name: 'login'})
})

export default router
