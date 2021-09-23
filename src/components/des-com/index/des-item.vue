<template>
  <div id="des-item">
    <div>
      <!-- <img :src="desItem.fileToken"/> -->
      <div>
        <div>{{ desItem.topic }}</div>
        <div>{{ desItem.keyWord ? desItem.keyWord : "暂无简介" }}</div>
      </div>
    </div>
    <div class="btn">
      <div>查看</div>
      <div>详细</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DesItem extends Vue {
  @Prop({}) private desItem!: object;

  created() {
    console.log(this.desItem);
  }
}
</script>
<style lang="less">
</style>