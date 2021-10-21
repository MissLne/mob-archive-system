<template>
  <div id="temp-arch-upload">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div><!-- 占header的位置 -->

    <ArchList
      ref="archList"
      :canClickItem="false"
      :listData="listData"
      :editName="'著录'"
      @passClickIndex="passDetailData"
      @stopSelect="stopSelect"
    />
    <UploadBtn :disabled="disabledUpload" @uploadFiles="onUploadFiles"/>

  
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'
import UploadBtn from '@/components/public-com/UploadBtn.vue';
import ArchList from '@/components/public-com/ArchList.vue';
import DesHead from '@/components/des-com/index/des-head.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import { createFileChunk, getFileMd5, uploadFile } from '@/utils/utils-upload';
// import fileUtils from '@/utils/fileUtils';

interface SomeData {
  fondsIdentifier: any;
  dossierType: any;
  departmentTree: any;
}

@Component({
  components: {
    UploadBtn,
    ArchList,
    DesHead,
  }
})
export default class TempArchUpload extends Vue {
  private listData: Array<ArchItemData> = []
  private someData: SomeData | null = null;
  // 正在上传时，禁止上传
  private disabledUpload: boolean = false;
  // 头部栏数据
  public headData = {
    title: '新建',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: false,
    rightUrl: "",
    rightText: "选择",
    isShow: false,
  }

  private created() {
    this.getTempArchList()
  }
  // ajax获取数据
  private getTempArchList() {
    this.listData = [];
    this.$service.get('/api/api/archive/selectTemporaryArchive')
      .then(({data: res}: any) => {
        console.log('temp-arch-list-data', res)
        res = res.data;
        this.listData = res;
      })
      .catch((err: any) => {
        console.log('temp-arch-list-data', err)
      })
  }
  // ajax添加数据
  private addTempArch({fileId, thumbnailFileId, zippedFileId}: any) {
    this.$service.post('/api/api/archive/addTemporaryArchive', [
      {fileId, thumbnailFileId, zippedFileId}
    ])
      .then(({data: res}: any) => {
        console.log(res)
      })
  }
  // 上传文件
  private onUploadFiles (file: File) {
    MsgBox.success('文件上传中...', true)
    this.disabledUpload = true;

    const fileChunkList = createFileChunk(file);
    const Md5 = getFileMd5(fileChunkList)
    uploadFile(Md5, file.name, fileChunkList, file.type)
      .then((res: any) => {
        console.log('分片上传成功', res);
        return this.addTempArch(res.data)
      })
      .then((res: any) => {
        console.log('添加临时档案', res);
        MsgBox.changeStatus('上传成功', true);
        this.getTempArchList();
      })
      .catch((err: any) => {
        console.log('失败', err);
        MsgBox.changeStatus('上传失败', false);
      })
      .finally(() => {
        MsgBox.closeBox();
        this.disabledUpload = false;
      })
  }
  // 将选择的档案传出去
  @Emit('passDetailData')
  passDetailData(indexList: Array<number>) {
    // 开始编辑时，结束选择，启用上传
    this.disabledUpload = false;
    return indexList.map((value) => {
      return this.listData[value];
    });
  }
  
  // header的左边（返回）和右边（选择）
  public headClick({clickType}: any) {
    if (clickType === 'left') {
      this.$router.go(-1);
    }
    else {
      if (this.listData.length) {
        (this.$refs.archList as ArchList).onChecking()
        this.headData.rightText = '全选'
        // 开始选择时，禁用上传
        this.disabledUpload = true
      }
      else
        MsgBox.error('请先上传文件')
    }
  }
  // 停止选择
  public stopSelect() {
    this.headData.rightText = '选择'
    // 取消选择状态时，结束选择，启用上传
    this.disabledUpload = false;
  }
}
</script>

<style lang="scss">
  #temp-arch-upload {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px 25px 0;
  }
</style>