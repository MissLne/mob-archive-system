import service from "@/utils/http"

/**
 * 获取图片的额外数据
 */
export const getImageMetadata = (params: any) => {
  return service({
    url: '/api/api/image/getImageMetadata',
    method: 'GET',
    params
  })
}

/**
 * 查询临时档案
 */
export const selectTemporaryArchive = () => {
  return service({
    url: '/api/api/archive/selectTemporaryArchive',
    method: 'GET',
  })
}

/**
 * 提交临时档案，转换为正式档案
 */
 export const changeTemporaryArchiveToNormalArchive = (data: any) => {
  return service({
    url: '/api/api/archive/changeTemporaryArchiveToNormalArchive',
    method: 'POST',
    data,
  })
}

/**
 * 新增/暂存临时档案
 */
 export const addTemporaryArchive = (data: any) => {
  return service({
    url: '/api/api/archive/addTemporaryArchive',
    method: 'POST',
    data
  })
}

/**
 * 删除临时档案
 */
export const deleteTemporaryArchive = (data: any) => {
  return service({
    url: '/api/api/archive/deleteTemporaryArchive',
    method: 'POST',
    data
  })
}