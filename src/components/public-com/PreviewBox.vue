<template>
  <div class="preview-box">
    <span class="preview-title">预览</span>
    <img
      :src="picSrc"
      class="preview-img"
      @click="preview"
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ImagePreview } from 'vant';
import { downloadPic } from '@/utils/utils-file';

@Component
export default class PreviewBox extends Vue {
  @Prop() picSrc!: string;
  @Prop() fileToken!: string;
  @Prop() fileType!: string;
  private clearPicSrc: string = ''; // 清晰图
  preview() {
    if (!this.fileType || this.fileType.split('/')[0] !== 'image')
      return;
    else if (!this.fileToken) {
      ImagePreview([this.picSrc])
    }
    else if (this.clearPicSrc) {
      ImagePreview([this.clearPicSrc]);
    }
    else
      // 先亮出来，免得用户觉得没反应
      ImagePreview([])
      downloadPic(this.fileToken, this.fileType)
        .then((picSrc: any) => {
          this.clearPicSrc = picSrc;
          ImagePreview([this.clearPicSrc]);
        })
        .catch((err: any) => 
          console.log(err)
        )
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