import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import request from '@/utils/api'
import service from '@/utils/http'
import "./utils/rem.ts"
import  axios from 'axios'
import Vant from 'vant';
import 'vant/lib/index.css';



Vue.use(Vant);
Vue.prototype.$service = service;
Vue.prototype.$request = request;
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
