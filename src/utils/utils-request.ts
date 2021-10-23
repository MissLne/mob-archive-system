import service from "./http"
import store from "@/store"
import { AxiosRequestConfig } from "axios"

export default {
  async get(suffix: string, urlPrefix: string, config?: AxiosRequestConfig | undefined) {
    if (store.getters.permissionList(suffix) !== -1)
      return service.get(urlPrefix + suffix, config)
    else if (store.getters.permissionList(`manager${suffix}`) !== -1)
      return service.get(`${urlPrefix}manager${suffix}`, config)
    else if (store.getters.permissionList(`user${suffix}`) !== -1) {
      return service.get(`${urlPrefix}user${suffix}`, config)
    }
    else throw Error('权限不足')
  },
  async post(suffix: string, urlPrefix: string, data?: object, config?: AxiosRequestConfig | undefined) {
    console.log(store.getters.permissionList(`manager${suffix}`))
    if (store.getters.permissionList(suffix) !== -1)
      return service.post(urlPrefix + suffix, data, config)
    else if (store.getters.permissionList(`manager${suffix}`) !== -1)
      return service.post(`${urlPrefix}manager${suffix}`, data, config)
    else if (store.getters.permissionList(`user${suffix}`) !== -1) {
      return service.post(`${urlPrefix}user${suffix}`, data, config)
    }
    else throw Error('权限不足')
  }
}