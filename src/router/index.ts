import store from '@/store'
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
        meta: { keepAlive: true },
        path: 'detail/x',
        name: 'tempArchDetail',
        component: () => import('@/views/temp-arch/TempArchDetail.vue'),
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
        meta: { keepAlive: true },
        path: 'detail/x',
        name: 'archDetail',
        component: () => import('@/views/other/archDetail/ArchDetail.vue'),
      },
    ]
  },
  {
    meta: { keepAlive: true },
    path: '/face-recognition/x/x',
    component: () => import('@/views/face-recognition/FaceRecognition.vue'),
    children: [
      {
        meta: { keepAlive: true },
        path: '/',
        name: 'faceList',
        component: () => import('@/views/face-recognition/FaceList.vue'),
      },
      {
        meta: { keepAlive: true },
        path: 'detail/x',
        name: 'faceDetail',
        component: () => import('@/views/face-recognition/FaceDetail.vue'),
      }
    ]
  },
  {
    meta: { keepAlive: true },
    path: '/meta-data/x/x/x',
    name: 'metaData',
    component: () => import('@/views/meta-data/MetaData.vue'),
    props: true,
  },
  {
    path: '/recycle-bin/x',
    name: 'recycleBin',
    component: () => import('@/views/recycle-bin/RecycleBin.vue'),
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

function isture(to: any) {
  return to.meta && to.meta.keepAlive;
}

function setMeta(to: any) {
  if (!to.meta) {
    to.meta = {}
  }
  else if (!to.meta.keepAlive) {
    to.meta.keepAlive = true;
  }
  else
    to.meta.keepAlive = false;
}

router.beforeEach((to, from, next) => {
  if ((to.meta as any).keepAlive) {
    store.commit('setDetailAlive', true)
  }
  else {
    store.commit('setDetailAlive', false)
  }
  if (to.name === 'login'
    || to.name?.includes('collectFiles')
    || localStorage.getItem('token')
  )
    next();
  else
    next({name: 'login'})
})

export default router
