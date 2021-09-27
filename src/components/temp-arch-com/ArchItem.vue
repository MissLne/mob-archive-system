<template>
  <div class="arch-item" @click="onClick">
    <img :src="picSrc" alt="" class="pic">
    <h3 class="title">{{itemData.fileName}}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import fileutils from '@/utils/fileutils'
import { ArchItemData } from 'vue/types/vue';


@Component
export default class ArchItem extends Vue {
  @Prop() itemData!: ArchItemData;
  private picSrc: string = '';
  onClick() {
    this.$emit('onClick');
  }
  created() {
    fileutils.downloadPic(this.itemData.thumbnailFileToken, this.itemData.thumbnailFileType)
      .then((res: any) => {
        this.picSrc = res;
      })
  }
}
</script>

<style lang="scss">
  .arch-item {
    overflow: hidden;
    // 暂时想到的图片居中方案
    /* display: flex;
    justify-content: center; */

    width: 200px;
    height: 200px;
    background-color: #fff;
    text-align: center;
    border-radius: 12px;
    .pic {
      height: 100%;
    }
    .title {
      overflow: hidden;
      position: absolute;
      bottom: -33px;
      width: 100%;
      height: 23px;
      font-size: 22px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>