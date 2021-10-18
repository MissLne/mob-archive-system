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
      },
      {
        path: 'face-recognition',
        name: 'faceRecognition',
        component: () => import('@/views/collect-files/FaceRecognition.vue'),
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
        path: 'detail',
        name: 'tempArchDetail',
        component: () => import('@/views/temp-arch/TempArchDetail.vue'),
      },
      {
        path: 'detail/meta',
        name: 'tempArchMeta',
        component: () => import('@/views/temp-arch/TempArchMeta.vue'),
      },
    ]
  },
  {
    path: '/myDes',
    name: 'myDes',
    component: () => import('@/views/other/desPage/myDes.vue'),
  },
  {
    path: '/archdetail',
    name: 'archDetail',
    component: () => import('@/views/other/archDetail/ArchDetail.vue'),
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
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
