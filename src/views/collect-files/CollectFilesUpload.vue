<template>
  <div id="collect-files-upload">
    <des-head @handleClick="headClick">
      {{theme.topic}}
      <template #right>{{isChecking ? '全选' : '选择'}}</template>
    </des-head>
    <div class="slots"></div><!-- 占header的位置 -->
    <ThemeSummary
      v-if="themeList.length && Object.keys(theme).length"
      :theme="theme"
    />
    <ArchList
      ref="ArchList"
      :listData="listData"
      @passClickIndex="passDetailData"
      v-model="isChecking"
    />
    <UploadBtn :disabled="!canUpload" @uploadFiles="onUploadFiles"/>
    <div v-if="!listData.length" class="upload-hint">点我上传 →</div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import UploadBtn from '@/components/public-com/UploadBtn.vue';
import ArchList from '@/components/public-com/Archive/ArchList.vue';
import DesHead from '@/components/des-com/index/des-head.vue';
import MsgBox from '@/components/public-com/MsgBox/Msg';
import ThemeSummary from '@/components/public-com/Theme/ThemeSummary.vue'
import { Dialog } from 'vant'
import { visitorUpload } from '@/services/collect-files';
import { isImage, toObjectURL, estimateFileType } from '@/utils/picture'

@Component({
  components: {
    UploadBtn,
    ArchList,
    DesHead,
    ThemeSummary,
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
        this.$emit('passTheme', t[themeId])
    }
    return t
  }
  // 上传文件后返回的数据
  private listData: Array<any> = [];
  // 正在上传时禁止，上传结束启用
  // 正在选择时禁止，[取消选择，进入编辑]启用
  private canUpload: boolean = true;
  // 是否选择状态，v-model to ArchList
  private isChecking: boolean = false;
  // 开始选择
  public startSelect() {
    // 开始选择状态时，结束上传
    this.isChecking = true;
    (this.$refs['ArchList'] as ArchList).onChecking();
    this.canUpload = false;
  }
  // 停止选择
  public stopSelect() {
    // 取消选择状态时，启用上传
    this.isChecking = false;
    this.canUpload = true;
  }
  // 是否都提交了
  get isAllSubmitted(): boolean {
    for (let i = 0; i < this.listData.length; ++i) {
      if (this.listData[i].isSubmitted === undefined)
        return false;
    }
    return true;
  }
  // 上传文件
  private async onUploadFiles (file: File) {
    MsgBox.success('文件上传中...', true)
    // 正在上传时禁止
    this.canUpload = false;

    const formData = new FormData();
    formData.append('multipartFile', file);
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
        fileData.picSrc = toObjectURL(file)
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
      this.canUpload = true;
    }
  }
  // 编辑，点击或选择后，将数据传给父组件
  @Emit('passDetailData')
  passDetailData(indexList: Array<number>) {
    // 开始编辑时，结束选择
    this.stopSelect();
    return indexList.map(value => this.listData[value]);
  }
  // header的左边（返回）和右边（选择）
  headClick({clickType}: any) {
    // 正在上传不给点头部
    if (!this.isChecking && !this.canUpload) return;
    if (clickType === 'left') {
      if (this.isChecking)
        this.stopSelect()
      else
        this.$router.go(-1)
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
      if (this.listData.length)
        this.startSelect()  
      else
        MsgBox.error('请先上传文件')
    }
  }
}
</script>

<style lang="scss">
  #collect-files-upload {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px 25px;
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