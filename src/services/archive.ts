import service from "@/utils/http"

export const getArchiveDetail = (params: any) => {
  return service({
    url: '/api/api/archive/getArchiveDetail',
    method: 'GET',
    params: params,
  })
}

export const getArchiveList = (params: any) => {
  return service({
    url: '/api/api/archive/getArchiveList',
    method: 'GET',
    params: params,
  })
}