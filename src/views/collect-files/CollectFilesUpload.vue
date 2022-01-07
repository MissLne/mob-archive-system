<template>
  <div id="collect-files-upload">
    <des-head :headData="headData" @handleClick="headClick">{{theme.topic}}</des-head>
    <div class="slots"></div><!-- 占header的位置 -->
    <ul
      v-if="themeList.length && Object.keys(theme).length"
      class="theme-detail"
    >
      <li class="created-time">{{theme.createdTime.split('T').join(' ')}}</li>
      <li class="department">创建部门：{{theme.department}}</li>
      <li class="content">{{theme.content}}</li>
    </ul>
    <ArchList
      ref="archList"
      :listData="listData"
      @passClickIndex="passDetailData"
      @stopSelect="stopSelect"
    />
    <UploadBtn :disabled="disabledUpload" @uploadFiles="onUploadFiles"/>
    <div v-if="!listData.length" class="upload-hint">点我上传 →</div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import UploadBtn from '@/components/public-com/UploadBtn.vue';
import ArchList from '@/components/public-com/Archive/ArchList.vue';
import DesHead from '@/components/des-com/index/des-head.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import { Dialog } from 'vant'
import { visitorUpload } from '@/services/collect-files';
import { isImage, toBase64, estimateFileType } from '@/utils/picture'

@Component({
  components: {
    UploadBtn,
    ArchList,
    DesHead,
  }
})
export default class CollectFilesUpload extends Vue {
  // 主题信息
  @Prop() theme!: Theme;
  get themeList() {
    const t = this.$store.state.selectData.themeList
    if (t.length) {
      const themeId = Number.parseInt(this.$route.params.themeId)
      if (themeId)
        this.$emit('passTheme', t[themeId - 1])
    }
    return t
  }
  // 上传文件后返回的数据
  private listData: Array<any> = [];
  // 正在上传时，禁止上传
  private disabledUpload: boolean = false;
  // 正在上传时，禁止选择
  private disabledCheck: boolean = false;
  // 头部栏数据
  public headData = {
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
      MsgBox.changeStatus('上传成功');
      
      const fileData: UploadFileData = data.data;
      // 设置一下名字
      fileData.fileName = file.name;
      // 如果是图片
      if (isImage(file.type))
        fileData.picSrc = toBase64(file)
      // 如果不是图片
      else
        fileData.picSrc = estimateFileType(file.type)
      // 处理完毕，插入数据列表
      this.listData.splice(0, 0, fileData);
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
      this.$router.go(-1);
      /* if (this.isAllSubmitted)
        this.$router.go(-1);
      else {
        Dialog.confirm({
          title: '未提交的信息将会丢失',
          cancelButtonText: '否',
          confirmButtonText: '是',
        }).then(() => {
          this.$router.go(-1);
        }).catch(() => {})
      } */
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
    return indexList.map(value => this.listData[value]);
  }
}
</script>

<style lang="scss">
  #collect-files-upload {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 0 25px;
    .theme-detail {
      border: 4px solid #8ebefe;
      margin: 20px 0;
      padding: 20px;
      font-size: 26px;
      line-height: 50px;
      border-radius: 20px;
      .created-time {
        color: #999;
      }
      .department {
        color: #5ca2ff;
      }
    }
    .upload-hint {
      position: fixed;
      left: 257px;
      bottom: 125px;
      color: rgba(0, 0, 0, 0.2);
      font-size: 42px;
      font-family: PingFang SC;
      font-weight: bold;
    }
  }
</style>