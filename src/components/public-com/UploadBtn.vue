<template>
  <transition name="upload-move">
    <div v-show="!disabled" id="upload">
      <input type="file" class="select-files" @change="uploadFiles">
      <!-- :disabled="disabled" -->
      <img src="@/assets/button/upload.png" class="icon">
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class UploadBtn extends Vue {
  @Prop({default: false}) disabled!: boolean;
  uploadFiles({target: {files}}: {target: HTMLInputElement}) {
    console.log('上传组件提醒您，您上传了：', files)
    if (files?.length)
      this.$emit('uploadFiles', files[0]);
  }
}
</script>

<style lang="scss">
  #upload {
    z-index: 100;
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 82px;
    height: 82px;
    .select-files {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    .icon {
      width: 100%;
      height: 100%;
    }
    // 动画
    &.upload-move-enter,
    &.upload-move-leave-to {
      transform: translateY(150px);
    }
    &.upload-move-enter-active {
      transition: transform 0.35s ease-out;
    }
    &.upload-move-leave-active {
      transition: transform 0.25s ease-in;
    }
    &.upload-move-enter-to,
    &.upload-move-left {
      transform: translateY(0px);
    }
  }
</style>