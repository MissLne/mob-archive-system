import service from "@/utils/http"
import { ResponseType } from "axios"

export const download = (fileToken: string, responseType: ResponseType) => {
  return service({
    url: `/api/api/file/download/${fileToken}`,
    method: 'GET',
    responseType: responseType
  })
}