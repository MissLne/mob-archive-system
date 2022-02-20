import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from '@/utils/api'
import service from '@/utils/http'
import "./utils/rem.ts"
import 'vant/lib/index.css';
import localStore from "@/utils/local"
import { Calendar, Image } from 'vant';
import VueXss from 'vue-xss'
var options = {
  // 默认白名单参考 xss.whiteList
  whiteList: {
    div: ['align', 'title', 'style'],
    p: ['align', 'style'],
    span: ['align', 'style'],
    img: ['align', 'alt', 'src', 'target', 'title', 'style'],
    h1: ['align', 'style'],
    h2: ['align', 'style'],
    h3: ['align', 'style'],
    h4: ['align', 'style'],
    h5: ['align', 'style'],
    h6: ['align', 'style'],
  },
  stripIgnoreTag: true, // 去掉不在白名单上的标签   true：去掉不在白名单上的标签
  stripIgnoreTagBody: ['script', 'style'], // 去掉不在白名单上的标签及标签体   ['tag1', 'tag2']：仅去掉指定的不在白名单上的标签
  CSS:{
    whiteList: {
      position: /^fixed|relative$/,
      top: true,
      left: true,
    },
  }
}


Vue.use(Calendar);
Vue.use(Image);
Vue.use(VueXss,options)
Vue.prototype.$service = service;
Vue.prototype.$request = request;
Vue.prototype.$localStore = localStore
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
