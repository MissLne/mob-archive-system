interface ArchItemData {
  id:	number,
  userId:	number,

  fileId:	number,
  fileName:	string,
  fileToken: string,
  fileType:	string,

  thumbnailFileName: string,
  thumbnailFileId: number,
  thumbnailFileToken: string,
  thumbnailFileType: string,

  zippedImageFileId: number,
  zippedImageFileToken: string,

  topic: string,
  categoryCodeId:	number,
  confidentialLevel: number,
  retentionPeriod: number,
  departmentId:	number,
  fondsIdentifierId: number,
  
  picSrc?: string,
}

interface UploadFileData {
  contentType: string,

  fileId: number,
  fileToken: string,

  thumbnailFileId: number,
  thumbnailFileToken: string,
  thumbnailContentType: string,

  zippedImageFileId: number,
  zippedImageFileToken: string,

  picSrc?: string,
  fileName?: string,

  saveData?: any,
  [key: string]: any,
}

interface MetaDataItem {
  id: number,
  parentId: number,
  metadataName: string,
  metadataValue: any,
  child: Array<MetaDataItem>
}

interface MetaDataStruct {
  publicMetadataStruct: Array<MetaDataItem>
  specialMetadataStruct: Array<MetaDataItem>
  audioMetadataStruct?: Array<MetaDataItem>
  imageMetadataStruct?: Array<MetaDataItem>
  videoMetadataStruct?: Array<MetaDataItem>
  [key: string]: Array<MetaDataItem>
}

interface FaceData {
  department: string
  identity: string
  information: string
  name: string
  position: string
  uid: number
  url: string
  [key: string]: string | number
}