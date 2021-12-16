import service from "@/utils/http"

export const getPartDossierList = (data: any) => {
  return service({
    url: '/api/api/dossier/getPartDossierList',
    method: 'POST',
    data: data,
  })
}