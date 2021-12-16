<template>
  <div id="collect-files-upload">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div><!-- 占header的位置 -->
    
    <ArchList
      ref="archList"
      :listData="listData"
      @passClickIndex="passDetailData"
      @stopSelect="stopSelect"
    />
    <UploadBtn :disabled="disabledUpload" @uploadFiles="onUploadFiles"/>
    <div v-if="!listData.length" class="uploadHint">点我上传 →</div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import UploadBtn from '@/components/public-com/UploadBtn.vue';
import ArchList from '@/components/public-com/ArchList.vue';
import DesHead from '@/components/des-com/index/des-head.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import { setPicSrc } from '@/utils/utils-file';
import { Dialog } from 'vant'
import { visitorUpload } from '@/services/CollectFiles';

@Component({
  components: {
    UploadBtn,
    ArchList,
    DesHead,
  }
})
export default class CollectFilesUpload extends Vue {
  // 上传文件后返回的数据
  private listData: Array<any> = [];
  // 正在上传时，禁止上传
  private disabledUpload: boolean = false;
  // 正在上传时，禁止选择
  private disabledCheck: boolean = false;
  // 头部栏数据
  public headData = {
    title: '校史征集',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: false,
    rightUrl: "",
    rightText: "选择",
    isShow: false,
  }
  get isAllSubmitted(): boolean {
    for (let i = 0; i < this.listData.length; ++i) {
      if (this.listData[i].isSubmitted === undefined)
        return false;
    }
    return true;
  }
  // 上传文件
  private async onUploadFiles (file: File) {
    const formData = new FormData();
    formData.append('multipartFile', file);

    MsgBox.success('文件上传中...', true)
    this.disabledUpload = true;
    this.disabledCheck = true;

    try {
      const { data } = await visitorUpload(formData);
      if (data.code !== 200)
        throw Error(data.message);
    
      console.log('上传成功', data);
      MsgBox.changeStatus('上传成功');
      
      const fileData: UploadFileData = data.data;
      this.listData.splice(0, 0, fileData);
      this.$set(this.listData[0], 'fileName', file.name)
      setPicSrc(fileData, file);
      
    } catch (error: any) {
      console.log('上传失败', error.message)
      MsgBox.changeStatus('上传失败', false);
    } finally {
      MsgBox.closeBox(1000);
      this.disabledUpload = false;
      this.disabledCheck = false;
    }
  }
  // header的左边（返回）和右边（选择）
  public headClick({clickType}: any) {
    // 正在上传不给点头部
    if (this.disabledCheck) return;
    if (clickType === 'left') {
      if (this.isAllSubmitted)
        this.$router.go(-1);
      else {
        Dialog.confirm({
          title: '未提交的信息将会丢失',
          cancelButtonText: '否',
          confirmButtonText: '是',
        }).then(() => {
          this.$router.go(-1);
        }).catch(() => {})
      }
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
  public stopSelect() {
    this.headData.rightText = '选择'
    // 取消选择状态时，结束选择，启用上传
    this.disabledUpload = false;
  }

  // 点击或选择后，将数据传给父组件
  @Emit('passDetailData')
  passDetailData(indexList: Array<number>) {
    // 开始编辑时，结束选择，启用上传
    this.disabledUpload = false;
    return indexList.map((value) => {
      return this.listData[value];
    });
  }
}
</script>

<style lang="scss">
  #collect-files-upload {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px 25px 0;
    .uploadHint {
      position: fixed;
      left: 257px;
      bottom: 72px;
      color: rgba(0, 0, 0, 0.2);
      font-size: 42px;
      font-family: PingFang SC;
      font-weight: bold;
    }
  }
</style>