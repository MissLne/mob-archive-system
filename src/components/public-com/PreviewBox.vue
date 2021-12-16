<template>
  <div class="preview-box">
    <span class="preview-title">预览</span>
    <img
      :src="picSrc"
      class="preview-img"
      @click="preview"
    >
    <!-- <video :src="picSrc" controls></video> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ImagePreview } from 'vant';
import { getSrcCertainly, isImage, isVideo } from '@/utils/picture';

@Component
export default class PreviewBox extends Vue {
  @Prop() picSrc!: string;
  @Prop() fileToken!: string;
  @Prop() fileType!: string;
  private clearPicSrc: string = ''; // 清晰图
  // 摧毁之前，释放一下对象url的内存
  beforeDestroy() {
    URL.revokeObjectURL(this.picSrc)
    URL.revokeObjectURL(this.clearPicSrc)
  }
  async preview() {
    if (!this.fileType) return;
    if (isVideo(this.fileType)) {

    }
    else if (isImage(this.fileType)) {
      if (!this.fileToken) {
        ImagePreview([this.picSrc])
      }
      else if (this.clearPicSrc) {
        ImagePreview([this.clearPicSrc]);
      }
      else
        // 先亮出来，免得用户觉得没反应
        ImagePreview([])
        const picSrc = await getSrcCertainly(this.fileType, this.fileToken) as string
        this.clearPicSrc = picSrc;
        ImagePreview([this.clearPicSrc]);
      }
    }
  }
</script>

<style lang="scss">
  .preview-box {
    $height: 186px;
    display: flex;
    justify-content: space-between;
    height: $height;
    margin-right: 75px;
    .preview-title {
      line-height: $height;
    }
    .preview-img {
      object-fit: cover;
      width: 186px;
      height: $height;
    }
  }
</style>