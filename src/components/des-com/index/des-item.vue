<template>
  <div id="des-item">
    <div>
      <img :src="desItem.fileToken ? desItem.fileToken : url" />
      <div class="title">
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
  private url = require("@/assets/index/anjuan.png");
  created() {
    console.log(this.desItem);
  }
}
</script>
<style lang="scss">
#des-item {
  width: 690px;
  height: 267px;
  border-radius: 12px;
  background: #fff;
  box-sizing: border-box;
  padding: 39px 42px 32px 45px;
  margin: 22px auto 0 auto;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.59);
  img {
    width: 150px;
    height: 150px;
  }
  > div:nth-of-type(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
      color: #444;
    div:nth-of-type(1) {
      width: 390px;
      height: 28px;
      font-size: 30px;
    }
    div:nth-of-type(2) {
      margin-top: 27px;
      width: 448;
      height: 95px;
      font-size: 20px;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>