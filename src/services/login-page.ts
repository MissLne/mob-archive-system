import service from "@/utils/http";

export const postLogin = (data: any) => {
  return service({
    url: '/api/api/user/login',
    method: 'POST',
    data: data,
  })
}

export const getFileMetadataStructTree = () => {
  return service({
    url: '/api/api/archive/getFileMetadataStructTree',
    method: 'GET',
  })
}

export const getFondsIdentifier = () => {
  return service({
    url: '/api/api/fondsIdentifier/getFondsIdentifier',
    method: 'GET',
  })
}

export const getDossierType = () => {
  return service({
    url: '/api/api/type/getDossierType',
    method: 'GET',
  })
}

export const getDepartmentTree = () => {
  return service({
    url: '/api/api/department/getDepartmentTree',
    method: 'GET',
  })
}

