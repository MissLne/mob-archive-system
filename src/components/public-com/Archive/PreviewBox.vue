<template>
  <div class="preview-box">
    <span class="title">预览</span>

    <IconWrapper
      v-if="isVideo"
      @click.native="preview()"
    >
      <img :src="picSrc" class="img">
    </IconWrapper>
    <img
      v-else
      :src="picSrc"
      class="img"
      @click="preview()"
    />
    
    <VideoPrivew
      v-if="isVideo"
      :fileToken="fileToken"
      :fileType="fileType"
      v-model="videoShow"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ImagePreview } from 'vant';
import { getSrcCertainly, isImage, isVideo } from '@/utils/picture';
import VideoPrivew from './VideoPreview.vue'
import IconWrapper from '../IconWrapper.vue'

@Component({
  components: {
    VideoPrivew,
    IconWrapper,
  }
})
export default class PreviewBox extends Vue {
  @Prop() picSrc!: string;
  @Prop() fileToken!: string;
  @Prop() fileType!: string;
  
  private clearPicSrc: string = ''; // 清晰图
  private videoShow: boolean = false;
  get isImage() {
    return isImage(this.fileType)
  }
  get isVideo() {
    return isVideo(this.fileType)
  }
  
  // 摧毁之前，释放一下对象url的内存
  beforeDestroy() {
    URL.revokeObjectURL(this.clearPicSrc)
  }
  async preview() {
    if (!this.isImage && !this.isVideo) return;
    this.videoShow = true;

    if (this.isImage) {
      if (!this.fileToken) {
        ImagePreview([this.picSrc])
      }
      else if (this.clearPicSrc) {
        ImagePreview([this.clearPicSrc]);
      }
      else {
        // 先亮出来，免得用户觉得没反应
        ImagePreview([])
        this.clearPicSrc = await getSrcCertainly(this.fileType, this.fileToken) as string
        ImagePreview([this.clearPicSrc]);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .preview-box {
    $height: 186px;
    display: flex;
    justify-content: space-between;
    height: $height;
    margin-right: 75px;
    .title {
      line-height: $height;
    }
    .img {
      object-fit: cover;
      width: 186px;
      height: $height;
    }
    
  }
</style>