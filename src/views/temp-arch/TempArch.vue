<template>
  <div id="temp-arch">
    <router-view @navToDetail="getDetailData" :detailData="currentData"></router-view>

    <!-- 添加文件图标 -->
    <div id="upload">
      <input type="file" class="select-files" multiple @change="uploadFiles">
      <img src="@/assets/temp-arch/upload.png" alt="" class="icon">
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TempArch extends Vue {
  private currentData = null;
  getDetailData(e: any) {
    console.log('get!', e)
    this.currentData = e;
  }
  uploadFiles({target: {files}}: {target: HTMLInputElement}) {
    
  }
}
</script>

<style lang="scss">
  #temp-arch {
    width: 100vw;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px 25px 0;
    background-color: #EAF1FE;
    #upload {
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
  }
</style>