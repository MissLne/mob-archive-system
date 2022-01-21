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
      @click="preview"
    />

    <van-image-preview
      v-if="isImage"
      v-model="isShow"
      :images="images"
      class="image-preview"
    >
      <template #cover>
        <div
          v-show="fileToken && !clearPicSrc"
          class="bottom-bar"
        >
          <div
            class="btn"
            @click="getClearPicSrc"
          >{{percentage === null ? '查看原图' : percentage}}</div>
        </div>
      </template>
    </van-image-preview>
    
    <VideoPrivew
      v-if="isVideo"
      v-model="isShow"
      :fileToken="fileToken"
      :fileType="fileType"
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
    VanImagePreview: ImagePreview.Component
  }
})
export default class PreviewBox extends Vue {
  @Prop() picSrc!: string;
  @Prop() fileToken!: string;
  @Prop() fileType!: string;
  
  // 清晰图
  private clearPicSrc: string | null = null;
  // 加载清晰图的百分比
  private percentage: string | null = null;
  // 是否展示预览层
  private v_isShow: boolean = false;
  get isShow() {
    return this.v_isShow
  }
  set isShow(newValue: boolean) {
    this.v_isShow = newValue
    // 如果要变成true了，说明即将展示预览层，调小头部的z-index
    if (newValue) this.$store.dispatch('head/setZIndexAsync', 0)
    // 如果要变成false，说明即将关闭预览层，还原头部的z-index
    else this.$store.dispatch('head/setZIndexAsync')
  }
  get isImage() {
    return isImage(this.fileType)
  }
  get isVideo() {
    return isVideo(this.fileType)
  }
  get images() {
    return [this.clearPicSrc ?? this.picSrc]
  }
  
  // 摧毁之前，释放一下对象url的内存
  beforeDestroy() {
    if (this.clearPicSrc)
      URL.revokeObjectURL(this.clearPicSrc)
  }
  preview() {
    if (!this.isImage && !this.isVideo) return;
    this.isShow = true;
  }
  async getClearPicSrc() {
    this.clearPicSrc = await getSrcCertainly(
      this.fileType,
      this.fileToken,
      false, 
      e => this.percentage = `${Math.floor(e.loaded / e.total * 100)}%`,
    ) as string
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
    .image-preview {
      .bottom-bar {
        position: absolute;
        top: 94vh;
        width: 100vw;
        text-align: center;
        .btn {
          display: inline-block;
          padding: 10px;
          border: 2px solid #fff;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
</style>