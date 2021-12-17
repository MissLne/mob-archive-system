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
 
Vue.use(Calendar);
Vue.use(Image);

Vue.prototype.$service = service;
Vue.prototype.$request = request;
Vue.prototype.$localStore = localStore
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
