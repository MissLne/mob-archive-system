import service from '@/utils/http'

export const getCollectedFileType = (options?: any) => {
  return service({
    url: '/api/api/type/getCollectedFileType',
    method: 'GET',
  })
}

export const getAllDepartmentTree = (options?: any) => {
  return service({
    url: '/api/api/department/getAllDepartmentNameTree',
    method: 'GET',
  })
}
