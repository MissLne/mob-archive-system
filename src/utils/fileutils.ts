import service from "./http";
import Vue from "vue";
import SparkMd5 from "spark-md5"
import request from "./api";

const spark = new SparkMd5.ArrayBuffer();

/**
 * 根据token和type下载图片，并转成base64
 * @param fileToken 文件token
 * @param fileType 文件类型
 * @returns {Promise}
 */
export async function downloadPic(fileToken: string, fileType: string) {
  return service.get(`/api/api/file/download/${fileToken}`, { responseType: 'arraybuffer' })
    .then((data: any) => {
      return data = `data:${fileType};base64,` + btoa(new Uint8Array(data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    })
}

export function setPicSrc(data: UploadFileData, file: File) {
  if (data.contentType.split('/')[0] === 'image') {
    file.arrayBuffer().then((buffer) => {
      data.picSrc = `data:${data.contentType};base64,` + btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    })
    Vue.set(data, 'picSrc', data.picSrc);
  }
  else if (data.contentType) {
    data.picSrc = setPicByContentType(data.contentType)
  }
  else
    console.log('fail to set picSrc');
}

export function setPicByContentType(contentType: string): string {
  const strings = contentType.split('/'); 
  const suffix = strings[strings.length - 1];
  if (suffix.includes('pdf'))
    return require('@/assets/temp-arch/pdf.png')
  else if (suffix.includes('.document'))
    return require('@/assets/temp-arch/word.png')
  else if (suffix.includes('.presentation'))
    return require('@/assets/temp-arch/ppt.png')
  else if (suffix.includes('.sheet'))
    return require('@/assets/temp-arch/excel.png')
  else
    return require('@/assets/temp-arch/unknown.png')
}

/**
 * 递归地从树上寻找：具有名为keyName的键，且值等于keyValue的对象。并获取其名为idName的键对应的值。
 * @param tree 要搜索的树（孩子名为children）
 * @param keyValue 索引键值
 * @param keyName 索引键名
 * @param idName 搜索键值的键名
 * @param treeChildrenName 树的孩子名，默认为children
 * @returns 数字，找不到为undefined
 */
export function recursionGetId(tree: Array<any>, keyValue: string, keyName: string, idName: string, treeChildrenName: string = 'children') {
    // console.log(tree, keyValue, keyName, idName)
    let ans: any = undefined;
    if (tree)
      for (let i = 0; i < tree.length; ++i) {
        const child = tree[i];
        if (child[keyName] === keyValue) {
          ans = child[idName];
          // console.log(ans)
          break;
        }
        else {
          ans = recursionGetId(child[treeChildrenName], keyValue, keyName, idName);
          if (ans) break;
        }
      }
    return ans;
}

export function debonce(fn: Function, delay: number) {
    let timer: any;
    return function(this: any, ...args: Array<any>) {
      const _this = this;
      if (timer)
        clearTimeout(timer);
      timer = setTimeout(fn.bind(this, args), delay);
    }
}

// 以下为分片上传

/**
 * 文件切片
 * @param {file} file
 */
export function createFileChunk(file: File) {
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
 export function getFileMd5(fileChunkList: Array<any>) {
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
export const uploadFile = async (fileMd5Value: any, fileName: any, fileChunkList: any, fileType: any, files: any) => {
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
          files.onProgress({
            percent: current / fileChunkList.length * 100 | 0
          }, files.file);
          if (current++ === total) {
            resolve(res.data)
          } else {
            upload()
          }
        } else {
          reject(res.data)
        }
      })
    }
    upload()
  })
}

export function fillArchDetail(detailData: any, inputsProps: any) {
  // getArchiveDetail
  inputsProps.topic.value = detailData.topic;
  inputsProps.people.value = detailData.people;
  inputsProps.time.value = detailData.time?.split('T')[0];
  inputsProps.place.value = detailData.address;
  inputsProps.event.value = detailData.event;
  inputsProps.fondsIdentifierId.value = detailData.fondsName;
  inputsProps.categoryCodeId.value = detailData.categoryName;
  inputsProps.departmentId.value = detailData.departmentName;
  inputsProps.confidentialLevel.value = detailData.confidentialLevel;
  inputsProps.retentionPeriod.value = detailData.retentionPeriod;
}

/**
 * 递归遍历元数据树
 * @param tree 元数据树
 * @param handle 经过节点时遍历的函数
 */
export function dfsTree(tree: any, handle: (obj: MetaDataItem) => void) {
  for (let obj of tree) {
    handle(obj);
    if (obj.child)
      dfsTree(obj.child, handle);
  }
}