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
 * 将ArrayBuffer转为base64
 * @param fileType 文件MIME类型
 * @param buffer 
 * @returns 图片的base64编码
 */
export const toBase64 = (fileType: string, buffer: ArrayBuffer) => {
  return `data:${fileType};base64,${
    btoa(
      new Uint8Array(buffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
  }` 
}

/**
 * 是否图片
 * @return 布尔值
 */
export const isImage = (contentType: string) => {
  return contentType.split('/')[0] === 'image'
}

/**
 * 是否视频
 * @return 布尔值
 */
export const isVideo = (contentType: string) => {
  return contentType.split('/')[0] === 'video'
}

/**
 * 下载图片
 * @param fileType 文件MIME类型
 * @param fileToken 文件token
 * @return 图片的base64编码
 */
export const downloadPicture = async (fileType: string, fileToken: string) => {
  const { data } = await download(fileToken, 'arraybuffer');
  return toBase64(fileType, data);
}

/**
 * 根据文件类型，返回一个合适的src值
 * @param fileType 文件MIME类型
 * @param fileToken 文件token，可为空
 * @returns src可以使用的值
 */
export const getSrcCertainly = async (fileType: string, fileToken?: string) => {
  if (isImage(fileType) && fileToken)
    return await downloadPicture(fileType, fileToken)
  else
    return estimateFileType(fileType)
}