import service from "./http";
import Vue from "vue";

export default {
  async downloadPic(fileToken: string, fileType: string) {
    return service.get(`/api/api/file/download/${fileToken}`, { responseType: 'arraybuffer' })
      .then((data: any) => {
        return data = `data:${fileType};base64,` + btoa(new Uint8Array(data.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      })
  },
  setPicSrc(data: UploadFileData, file: File) {
    if (data.contentType.split('/')[0] === 'image') {
      file.arrayBuffer().then((buffer) => {
        data.picSrc = `data:${data.contentType};base64,` + btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      })
      Vue.set(data, 'picSrc', data.picSrc);
    }
    else if (data.fileName) {
      const strings = data.fileName.split('.'); 
      const suffix = strings[strings.length - 1];
      // Object.defineProperty(data, 'picSrc', 'test');
      console.log('passDetailData', data)
      if (suffix.includes('pdf'))
        data.picSrc = require('@/assets/temp-arch/pdf.png')
      else if (suffix.includes('doc'))
        data.picSrc = require('@/assets/temp-arch/word.png')
      else if (suffix.includes('ppt'))
        data.picSrc = require('@/assets/temp-arch/ppt.png')
      else if (suffix.includes('xlsx'))
        data.picSrc = require('@/assets/temp-arch/excel.png')
      else
        data.picSrc = require('@/assets/temp-arch/unknown.png')
    }
    else
      console.log('fail to set picSrc');
  },
  recursionGetId(tree: Array<any>, keyValue: string, keyName: string, idName: string): any {
    // console.log(tree, keyValue, keyName, idName)
    let ans: any = undefined;
    if (tree)
      for (let i = 0; i < tree.length; ++i) {
        const child = tree[i];
        // console.log(child[keyName])
        if (child[keyName] === keyValue) {
          ans = child[idName];
          // console.log(ans)
          break;
        }
        else {
          ans = this.recursionGetId(child.children, keyValue, keyName, idName);
          if (ans) break;
        }
      }
    return ans;
  },
  debonce(fn: Function, delay: number) {
    let timer: any;
    return function(this: any, ...args: Array<any>) {
      const _this = this;
      if (timer)
        clearTimeout(timer);
      timer = setTimeout(fn.bind(this, args), delay);
    }
  }
}