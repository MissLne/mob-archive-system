<template>
  <div class="arch-item" @click="onClick">
    <!-- <img :src="itemData.picSrc" alt="" class="pic"> -->
    <van-image :src="itemData.picSrc" fit="cover" class="pic"/>
    <h3 class="title">{{itemData.fileName}}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { downloadPicture, estimateFileType } from '@/utils/picture'
import { Image } from 'vant'

@Component
export default class ArchItem extends Vue {
  @Prop() itemData!: ArchItemData;

  @Emit('onClick')
  onClick() {
  }
  created() {
    const setPicture = async () => {
      const { thumbnailFileToken, fileType } = this.itemData
      
      if (thumbnailFileToken)
        this.$set(this.itemData, 'picSrc', await downloadPicture(thumbnailFileToken));
      else if (this.itemData.fileType)
        this.$set(this.itemData, 'picSrc', estimateFileType(fileType))
    }
    setPicture();
  }
  // 摧毁之前，释放一下对象url的内存
  beforeDestroy() {
    URL.revokeObjectURL(this.itemData.picSrc as any)
  }
}
</script>

<style lang="scss">
  .arch-item {
    overflow: hidden;
    // 暂时想到的图片居中方案，已被object-fit取代
    /* display: flex;
    justify-content: center; */
    width: 200px;
    text-align: center;
    .pic {
      width: 200px;
      height: 200px;
      // object-fit: cover;
      background-color: #fff;
      border-radius: 12px;
    }
    .title {
      overflow: hidden;
      width: 100%;
      height: 25px;
      margin-top: 8px;
      color: rgba(51, 51, 51, 1);
      font-size: 23px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>