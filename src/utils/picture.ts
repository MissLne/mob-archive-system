import { download } from "@/services/download";

/**
 * 根据文件类型，返回对应的图片
 * @param contentType 文件MIME类型
 * @returns require处理后的图片，可以直接放到src
 */
export const estimateFileType = (contentType: string) => {
  const strings = contentType.split('/'); 
  const suffix = strings[strings.length - 1];
  let type;
  if (suffix.includes('pdf'))
    type = 'pdf'
  else if (suffix.includes('.document') || suffix.includes('-word'))
    type = 'word'
  else if (suffix.includes('.presentation') || suffix.includes('-powerpoint'))
    type = 'ppt'
  else if (suffix.includes('.sheet'))
    type = 'excel'
  else
    type = 'unknown'
  return require(`@/assets/file-type/${type}.png`)
}

/**
 * Blob生成对象URL，需要注意释放url
 * @param buffer 
 * @returns 对象URL
 */
export const toObjectURL = (blob: Blob) => {
  return URL.createObjectURL(blob);
    // 原写法：将arraybuffer转为base64
    /* btoa(
      new Uint8Array(buffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    ) */
}

/**
 * 是否图片
 * @return 布尔值
 */
export const isImage = (contentType: string) => {
  return contentType && contentType.split('/')[0] === 'image'
}

/**
 * 是否视频
 * @return 布尔值
 */
export const isVideo = (contentType: string) => {
  return contentType && contentType.split('/')[0] === 'video'
}

/**
 * 下载图片
 * @param fileToken 文件token
 * @return 图片的base64编码
 */
export const downloadPicture = async (fileToken: string, onProgress?: (e: ProgressEvent) => void) => {
  const { data } = await download(fileToken, { responseType: 'blob', onDownloadProgress: onProgress });
  return toObjectURL(data);
}

/**
 * 根据文件类型，返回一个合适的src值
 * @param fileType 文件MIME类型
 * @param fileToken 文件token，可为空
 * @returns src可以使用的值
 */
export const getSrcCertainly = async (fileType: string, fileToken?: string, canVideo?: boolean, onProgress?: (e: ProgressEvent) => void) => {
  if (fileToken && (isImage(fileType) || (canVideo && isVideo(fileType))) )
    return await downloadPicture(fileToken, onProgress)
  else
    return estimateFileType(fileType)
}