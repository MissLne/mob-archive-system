import service from "@/utils/http"

// 案卷列表
export const getPartDossierList = (data: any) => {
  return service({
    url: '/api/api/dossier/getPartDossierList',
    method: 'POST',
    data,
  })
}

// 案卷详情
export const getDossierDetail = (params: any) => {
  return service({
    url: '/api/api/dossier/getDossierDetail',
    method: 'GET',
    params
  })
}