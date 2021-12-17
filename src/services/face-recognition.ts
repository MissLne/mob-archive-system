import service from "@/utils/http"

// 录入人脸信息
export const faceInformationEntry = (data: any) => {
  return service({
    url: '/api/api/face/faceInformationEntry',
    method: 'POST',
    data
  })
}

// 识别人脸信息
export const faceRecognition = (params: any) => {
  return service({
    url: '/api/api/face/faceRecognition',
    method: 'GET',
    params
  })
}