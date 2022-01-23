import store from '@/store'
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import crypto from "@/utils/crypto"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/description',
    meta: { keepAlive: true },
    component: () => import('@/views/Home.vue'),
    children: [
      {
        meta: { keepAlive: true, index: 0 },
        path: 'description',
        name: 'description',
        component: () => import('@/views/principal/Description.vue')
      },
      {
        meta: { keepAlive: true, index: 1 },
        path: 'apply',
        name: 'apply',
        component: () => import('@/views/principal/Apply.vue')
      },
      {
        meta: { keepAlive: true, index: 2 },
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
        path: 'theme',
        name: 'collectFilesTheme',
        component: () => import('@/views/collect-files/CollectFilesTheme.vue'),
      },
      {
        path: '',
        name: 'collectFilesUpload',
        component: () => import('@/views/collect-files/CollectFilesUpload.vue'),
      },
      {
        path: 'detail',
        name: 'collectFilesDetail',
        component: () => import('@/views/collect-files/CollectFilesDetail'),
      },
      {
        path: 'scan',
        name: 'collectFilesScan',
        component: () => import('@/views/collect-files/CollectFilesScan.vue'),
      }
    ]
  },
  {
    path: '/temp-arch',
    component: () => import('@/views/temp-arch/TempArch.vue'),
    children: [
      {
        path: '',
        name: 'tempArchUpload',
        component: () => import('@/views/temp-arch/TempArchUpload.vue'),
      },
      {
        path: 'detail',
        name: 'tempArchDetail',
        component: () => import('@/views/temp-arch/TempArchDetail'),
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
    ]
  },
  {
    path: '/face-recognition',
    component: () => import('@/views/face-recognition/FaceRecognition.vue'),
    children: [
      {
        path: '',
        name: 'faceList',
        component: () => import('@/views/face-recognition/FaceList.vue'),
      },
      {
        path: 'detail',
        name: 'faceDetail',
        component: () => import('@/views/face-recognition/FaceDetail.vue'),
      }
    ]
  },
  {
    path: '/meta-data',
    name: 'metaData',
    component: () => import('@/views/meta-data/MetaData.vue'),
    props: true,
  },
  {
    path: '/recycle-bin',
    name: 'recycleBin',
    component: () => import('@/views/recycle-bin/RecycleBin.vue'),
  },
  {
    path: '/theme',
    component: () => import('@/views/theme/Theme.vue'),
    children: [
      {
        path: '',
        name: 'themeList',
        component: () => import('@/views/theme/ThemeList.vue'),
      },
      {
        path: 'QR',
        name: 'themeQR',
        component: () => import('@/views/theme/ThemeQR.vue')
      }
    ]
  }
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
  if (['archDetail', 'tempArchDetail', 'metaData', 'faceList', 'faceDetail'].includes(to.name || '')) {
    store.commit('setIncludeList', ['Arch', 'TempArch']);
  }
  else {
    store.commit('setIncludeList', ['TempArch']);
  }
  // 没有token就踢出去
  if (to.name === 'login'
    || to.name?.includes('collectFiles')
    || localStorage.getItem("token")
  )
    next();
  else
    next({name: 'login'})
})

export default router
