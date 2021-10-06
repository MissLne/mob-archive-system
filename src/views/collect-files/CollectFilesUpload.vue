<template>
  <div id="collect-files-upload">
    <button @click="testMsgBox">测试</button>
    <ArchList
      :listData="listData"
      @passClickIndex="passDetailData"
    />
    <UploadBtn @uploadFiles="onUploadFiles"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import UploadBtn from '@/components/public-com/UploadBtn.vue';
import ArchList from '@/components/public-com/ArchList.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import fileutils from '@/utils/fileutils';

@Component({
  components: {
    UploadBtn,
    ArchList
  }
})
export default class CollectFilesUpload extends Vue {
  testMsgBox() {
    this.listData.unshift({fileName: '123.123'})
    MsgBox.success('aijfoiasjfdio', true);
    MsgBox.changeStatus('123');
    MsgBox.closeBox();
  }
  private listData: Array<any> = [{fileName: '123.sb'}, {}, {}, {}, {}, {}];
  private onUploadFiles (file: File) {
    const formData = new FormData();
    formData.append('multipartFile', file);

    this.$service.post('/api/api/file/visitorUpload', formData, {
      headers: { 'content-type': 'multipart/form-data' }
    })
    .then(({data: res}: any) => {
      if (res.code === 200) {
        console.log('上传成功', res);
        MsgBox.success('上传成功');
        
        const data: UploadFileData = res.data;
        data.fileName = file.name;

        fileutils.setPicSrc(data, file);
        this.listData.splice(0, 0, data);
      }
      else
        throw Error(res.message);
    })
    .catch((err: Error) => {
      console.log('上传失败', err.message)
      MsgBox.error(err.message)
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
  passDetailData(index: number) {
    return this.listData[index];
  }
}
</script>

<style lang="scss">
  #collect-files-upload {
    box-sizing: border-box;
    padding: 20px 25px 0;
  }
</style>