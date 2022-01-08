import service from "@/utils/http"

// 获取主题列表
export const getAllTheme = () => {
  return service({
    url: '/api/api/collectedFile/getAllTheme',
    method: 'POST'
  })
}

// 获取二维码
export const getQRCoder = (params: any) => {
  return service({
    url: '/api/api/file/getQrCoder',
    method: 'GET',
    responseType: 'blob',
    params
  })
}

// 创建新的二维码
export const createQRCoder = (data: { url: string, themeId: number }) => {
  return service({
    url: '/api/api/file/createQrCoder',
    method: 'POST',
    data
  })
}