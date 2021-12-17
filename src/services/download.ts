import service from "@/utils/http"
import { AxiosRequestConfig } from "axios"

export const download = (fileToken: string, options?:　AxiosRequestConfig) => {
  return service({
    url: `/api/api/file/download/${fileToken}`,
    method: 'GET',
    ...options
  })
}