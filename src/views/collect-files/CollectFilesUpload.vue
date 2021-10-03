<template>
  <div id="collect-files-upload">
    <button @click="testMsgBox">测试</button>
    <ArchList :listData="listData"/>
    <UploadBtn @uploadFiles="onUploadFiles"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import UploadBtn from '@/components/public-com/UploadBtn.vue';
import ArchList from '@/components/public-com/ArchList.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';

@Component({
  components: {
    UploadBtn,
    ArchList
  }
})
export default class CollectFilesUpload extends Vue {
  testMsgBox() {
    MsgBox.success('aijfoiasjfdio', 0, true);
    MsgBox.closeBox(1000);
  }
  private listData: Array<any> = [{}, {}, {}, {}, {}, {}];
  private fileList: Array<File> = [];
  private onUploadFiles (file: File) {
    const formData = new FormData();
    formData.append('multipartFile', file);

    this.$service.post('/api/api/file/visitorUpload', formData, {
      headers: { 'content-type': 'multipart/form-data' }
    })
    .then(({data}: any) => {
      switch (data.code) {
        case 200:
          this.listData.unshift(data.data);
          this.fileList.unshift(file);
          this.passDetailData(data.data);
          // break;
        default:
          console.log(data)
      }
    })
    .catch((err: any) => {
      console.log('上传失败', err)
    })
    /* this.fileList.unshift(file);
    this.listData.unshift({});
    this.passDetailData({
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      fileId: 248710,
      fileToken: "2021-09-30/ff16c86f-5e32-47d0-969c-6863ce23dcb5/20be1b91-6d09-4940-9288-439818e8763b.xlsx?token=a55aed8202d14290b8b74fb634874af1",
      thumbnailContentType: null,
      thumbnailFileId: null,
      thumbnailFileToken: null,
      zippedImageFileId: null,
      zippedImageFileToken: null,
    }) */
  }

  @Emit('passDetailData')
  passDetailData(data: any) {
    const strings = this.fileList[0].name.split('.'); 
    const suffix = strings[strings.length - 1];
    // Object.defineProperty(data, 'picSrc', 'test');
    console.log('passDetailData', data)
    if (suffix.includes('pdf'))
      data.picSrc = require('@/assets/temp-arch/pdf.png')
    else if (suffix.includes('word'))
      data.picSrc = require('@/assets/temp-arch/word.png')
    else if (suffix.includes('ppt'))
      data.picSrc = require('@/assets/temp-arch/ppt.png')
    else if (suffix.includes('xlsx'))
      data.picSrc = require('@/assets/temp-arch/excel.png')
    else
      data.picSrc = require('@/assets/temp-arch/unknown.png')


    return data;
  }
}
</script>

<style lang="scss">
  #collect-files-upload {
    box-sizing: border-box;
    padding: 20px 25px 0;
  }
</style>