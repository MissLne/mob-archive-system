<template>
  <div id="temp-arch-upload">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div><!-- 占header的位置 -->

    <!-- <button @click="getTempArchList">加载</button> -->
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
  // 获取数据
  private getTempArchList() {
    (this as any).$service.get('/api/api/archive/selectTemporaryArchive')
    .then((res: any) => {
      console.log('temp-arch-list-data', res)
      res = res.data.data;
      this.listData = res;
    })
    .catch((err: any) => {
      console.log('temp-arch-list-data', err)
    })
  }
  // 上传文件
  private onUploadFiles (file: File) {
    const formData = new FormData();
    formData.append('multipartFile', file);

    MsgBox.success('文件上传中...', true)
    this.disabledUpload = true;

    this.$service.post('/api/api/file/upload', formData, {
      headers: { 'content-type': 'multipart/form-data' }
    })
    .then(({data: res}: any) => {
      if (res.code === 200) {
        console.log('上传成功', res);
        MsgBox.changeStatus('上传成功');
        
        const data: UploadFileData = res.data;
        this.getTempArchList();
      }
      else
        throw Error(res.message);
    })
    .catch((err: Error) => {
      console.log('上传失败', err.message)
      // MsgBox.changeStatus(err.message, false);
      if (err.message === '不支持上传该文件类型')
        MsgBox.changeStatus('不支持上传该文件类型', false);
      else
        MsgBox.changeStatus('上传失败', false);
    })
    .finally(() => {
      MsgBox.closeBox(1000);
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