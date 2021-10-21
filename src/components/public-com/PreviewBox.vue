<template>
  <div class="preview-box">
    <span class="preview-title">预览</span>
    <img
      :src="picSrc"
      class="preview-img"
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ArchForm extends Vue {
  @Prop() picSrc!: string;
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