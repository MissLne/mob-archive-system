import service from '@/utils/http'

// 获取下拉菜单数据
export const getCollectedFileType = () => {
  return service({
    url: '/api/api/type/getCollectedFileType',
    method: 'GET',
  })
}

// 获取下拉菜单数据
export const getAllDepartmentTree = () => {
  return service({
    url: '/api/api/department/getAllDepartmentNameTree',
    method: 'GET',
  })
}

// 上传文件
export const visitorUpload = (data: any) => {
  return service({
    url: '/api/api/file/visitorUpload',
    method: 'POST',
    headers: { 'content-type': 'multipart/form-data' },
    data: data,
  })
}

// 提交文件
export const submitCollectedFile = (urlSuffix: string, data: any) => {
  return service({
    url: `/api/api/collectedFile/${urlSuffix}`,
    method: 'POST',
    data: data
  })
}

// 获取主题列表
export const getAllTheme = () => {
  return service({
    url: '/api/api/collectedFile/getAllTheme',
    method: 'POST'
  })
}