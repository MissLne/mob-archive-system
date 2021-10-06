interface ArchItemData {
  id:	number,
  userId:	number,

  fileId:	number,
  fileName:	string,
  fileToken: string,
  fileType:	string,

  thumbnailFileId: number,
  thumbnailFileName: string,
  thumbnailFileToken: string,
  thumbnailFileType: string,

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

  thumbnailContentType: string,
  thumbnailFileId: number,
  thumbnailFileToken: string,

  zippedImageFileId: number,
  zippedImageFileToken: string,

  picSrc?: string,
  fileName?: string,
}