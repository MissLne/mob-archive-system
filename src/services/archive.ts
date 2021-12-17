import service from "@/utils/http"

// 档案详情
export const getArchiveDetail = (params: any) => {
  return service({
    url: '/api/api/archive/getArchiveDetail',
    method: 'GET',
    params,
  })
}

// 档案列表
export const getArchiveList = (params: any) => {
  return service({
    url: '/api/api/archive/getArchiveList',
    method: 'GET',
    params,
  })
}

export const updateArchive = (data: any) => {
  return service({
    url: '/api/api/archive/updateArchive',
    method: 'POST',
    data
  })
}