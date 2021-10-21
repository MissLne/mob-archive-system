<template>
  <div class="arch-item" @click="onClick">
    <img :src="itemData.picSrc" alt="" class="pic">
    <h3 class="title">{{itemData.fileName}}</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { downloadPic } from '@/utils/utils-file'

@Component
export default class ArchItem extends Vue {
  @Prop() itemData!: ArchItemData;

  @Emit('onClick')
  onClick() {
  }
  created() {
    // console.log(this.itemData)
    if (this.itemData.thumbnailFileToken && this.itemData.thumbnailFileType) { // 类型为图片，不是校史征集，后台返回缩略图token
      downloadPic(this.itemData.thumbnailFileToken, this.itemData.thumbnailFileType)
      .then((res: any) => {
        this.$set(this.itemData, 'picSrc', res);
      })
    }
    /* else if (this.itemData.picSrc) { // 类型为图片，是校史征集，输入itemData时，前端整了个picSrc
      this.picSrc = this.itemData.picSrc;
    }
    else { // 类型不为图片，根据文件名后缀设置图片
      this.setFileDataPic();
    } */
  }
}
</script>

<style lang="scss">
  .arch-item {
    overflow: hidden;
    // 暂时想到的图片居中方案
    display: flex;
    justify-content: center;

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