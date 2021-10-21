import SparkMd5 from "spark-md5"
import request from "./api";

const spark = new SparkMd5.ArrayBuffer();

/**
 * 文件切片
 * @param {file} file
 */
export const createFileChunk = (file: File) => {
  const fileChunkList = []
  const CHUNK_SIZE = 2097152 // 切片大小为 2M

  for (let start = 0; start < file.size; start += CHUNK_SIZE) {
    fileChunkList.push({
      file: file.slice(start, start + CHUNK_SIZE)
    })
  }

  return fileChunkList
}

/**
 * 创建文件的 md5 标识
 * @param {array} fileChunkList
 */
export const getFileMd5 = (fileChunkList: Array<any>) => {
  let count = 0
  const totalCount = fileChunkList.length
  const fileReader = new FileReader()
  return new Promise((resolve, reject) => {
    fileReader.onload = (e: any) => {
      if (e.target && e.target.result) {
        count += 1
        spark.append(e.target.result)
      }
      if (count < totalCount)
        loadNext();
      else
        resolve(spark.end());
    }

    fileReader.onerror = function () {
      reject({
        message: '文件读取失败',
      })
    }

    const loadNext = () => {
      fileReader.readAsArrayBuffer(fileChunkList[count].file)
    }

    loadNext()
  })
}

const getChunk = async (wholeMd5: string) => {
  return await request.get('/api/api/file/getChunk', {wholeMd5});
}

/**
 * 上传文件（断点续传）
 * @param {*} fileMd5Value
 * @param {*} fileName
 * @param {*} fileChunkList
 */
export const uploadFile = async (fileMd5Value: any, fileName: any, fileChunkList: any, fileType: any, files?: any) => {
  let current = (await getChunk(fileMd5Value))?.data?.data + 1

  return new Promise((resolve, reject) => {
    const total = fileChunkList.length
    // 上传文件
    const upload = () => {
      const formData = new FormData()
      const file = new File([fileChunkList[current - 1].file], fileName, {
        type: fileType,
        lastModified: Date.now()
      })
      formData.append('file', file)
      formData.append('wholeMd5', fileMd5Value)
      formData.append('chunks', total)
      formData.append('chunk', current)

      request.formPost('/api/api/file/fileUpload', formData)
      .then(res => {
        if (res && res.data.code === 200) {
          /* files.onProgress({
            percent: current / fileChunkList.length * 100 | 0
          }, files.file); */
          if (current++ === total)
            resolve(res.data)
          else
            upload()
        }
        else
          reject(res.data)
      })
    }
    upload()
  })
}