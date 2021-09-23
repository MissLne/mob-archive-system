<template>
  <div id="des-btn">
    <div>
      <div @click="prePage">上一页</div>
      <div></div>
      <div @click="nextPage">下一页</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DesBtn extends Vue {
  prePage(): void {
    this.$emit('changePage',{type: 'prePage'})
  }
  nextPage(): void {
    this.$emit('changePage',{type: 'nextPage'})
  }
}
</script>
<style lang="less">

</style>