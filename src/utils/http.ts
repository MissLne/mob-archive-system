import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import router from '@/router/index'


const service = axios.create({
  timeout: 100000 
})

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (localStorage.getItem("token")) {
      config.headers.Authorization = localStorage.getItem("token")
    }
    config.headers["Content-Type"] = "application/json"
    return config
  },
  (err: any) => {
    Promise.reject(err)
  }
)
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (err: any) => {
    let errMsg = ''
    if (err && err.response.status) {
      switch (err.response.status) {
        case 401:
        case 420:
          errMsg = '登录状态失效，请重新登录'
          localStorage.removeItem('token')
          router.replace({name: 'login'})
          break
        case 403:
          errMsg = '拒绝访问'
          break
        case 408:
          errMsg = '请求超时'
          break
        default:
          errMsg = err.response.data.msg
          break
      }
    } else {
      errMsg = err
    }

    return Promise.reject(errMsg)
  }
)
export default service