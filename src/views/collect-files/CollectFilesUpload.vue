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

    <Alerts
      v-show="alertsData.isAlerts"
      :title="alertsData.title"
      @sureDelete="alertsSureHandle"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import UploadBtn from '@/components/public-com/UploadBtn.vue';
import ArchList from '@/components/public-com/ArchList.vue';
import DesHead from '@/components/des-com/index/des-head.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import { setPicSrc } from '@/utils/utils-file';
import Alerts from '@/components/tools/alerts.vue';

@Component({
  components: {
    UploadBtn,
    ArchList,
    DesHead,
    Alerts,
  }
})
export default class CollectFilesUpload extends Vue {
  // 上传文件后返回的数据
  private listData: Array<any> = [];
  // 正在上传时，禁止上传
  private disabledUpload: boolean = false;
  // 消息弹窗点击是的时候，调用的函数
  private alertsSureHandle = ({type}: any) => {};
  // 关于消息弹窗的数据
  private alertsData = {
    isAlerts: false,
    title: '',
    alerts(title: string) {
      this.isAlerts = true;  
      this.title = title;
    },
    close() {
      this.isAlerts = false;
    }
  }
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
  private onUploadFiles (file: File) {
    const formData = new FormData();
    formData.append('multipartFile', file);

    MsgBox.success('文件上传中...', true)
    this.disabledUpload = true;

    this.$service.post('/api/api/file/visitorUpload', formData, {
      headers: { 'content-type': 'multipart/form-data' }
    })
    .then(({data: res}: any) => {
      if (res.code === 200) {
        console.log('上传成功', res);
        MsgBox.changeStatus('上传成功');
        
        const data: UploadFileData = res.data;
        this.listData.splice(0, 0, data);
        // this.$set(data, 'fileName', file.name)
        this.$set(this.listData[0], 'fileName', file.name)
        setPicSrc(data, file);
      }
      else
        throw Error(res.message);
    })
    .catch((err: Error) => {
      console.log('上传失败', err.message)
      // MsgBox.changeStatus(err.message, false);
      MsgBox.changeStatus('上传失败', false);
    })
    .finally(() => {
      MsgBox.closeBox(1000);
      this.disabledUpload = false;
    })
  }
  // header的左边（返回）和右边（选择）
  public headClick({clickType}: any) {
    if (clickType === 'left') {
      if (this.isAllSubmitted) {
        this.alertsData.close()
        this.$router.go(-1);
      }
      else {
        this.alertsData.alerts('未提交的信息将会丢失');
        this.alertsSureHandle = ({type}: any) => {
          if (type === 'sure')
            this.$router.go(-1);
          else
            this.alertsData.close()
        }
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