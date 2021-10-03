<template>
  <div id="upload">
    <input type="file" class="select-files" @change="uploadFiles">
    <img src="@/assets/temp-arch/upload.png" alt="" class="icon">
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'

@Component
export default class UploadBtn extends Vue {
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
    bottom: 50px;
    right: 50px;
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
  }
</style>