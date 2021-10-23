import service from "./http";
import Vue from "vue";

/**
 * 根据token和type下载图片，并转成base64
 * @param fileToken 文件token
 * @param fileType 文件类型
 * @returns {Promise}
 */
export async function downloadPic(fileToken: string, fileType: string) {
  if (!fileType)
    console.log('文件类型不能为空')
  else if (fileType.split('/')[0] !== 'image')
    return setPicByContentType(fileType)
  else
    return service.get(`/api/api/file/download/${fileToken}`, { responseType: 'arraybuffer' })
      .then((data: any) => {
        return data = `data:${fileType};base64,` + btoa(new Uint8Array(data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      })
}

/**
 * 根据本地文件，以及后台返回的数据设置图片路径（针对校史征集）
 * @param data 后台返回的数据
 * @param file 本地文件
 */
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
  else if (suffix.includes('.document') || suffix.includes('-word'))
    return require('@/assets/temp-arch/word.png')
  else if (suffix.includes('.presentation') || suffix.includes('-powerpoint'))
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

/**
 * 针对ArchDetail页的填内容函数
 * @param detailData 后台返回数据
 * @param inputsProps 要填数据的对象
 */
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
  if (!tree) return;
  for (let obj of tree) {
    handle(obj);
    if (obj.child)
      dfsTree(obj.child, handle);
  }
}

/**
 * 初始化元数据
 * @param _this 组件中的this 
 */
export function initMetaData(_this: any, propMetaDataName: string ) {
  const dData = _this.detailData;
  _this.$store.commit('metaData/setMetaDataTree', {
    metaData: ((dData as any)[propMetaDataName] as Array<MetaDataItem>)
      .filter(value => {
        const name = value.metadataName;
        return name !== '人物'
          && name !== '时间'
          && name !== '地点'
          && name !== '事件'
      }),
    fileType: (dData as any).fileType.split('/')[0],
  });
}