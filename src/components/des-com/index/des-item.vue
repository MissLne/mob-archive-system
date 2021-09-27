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
      <div @click="showDetail">详细</div>
      <div>查看</div>
    </div>
    <div class="details" v-if="isShow" :class="{ close: isClose }"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DesItem extends Vue {
  @Prop({}) private desItem!: object;
  private isShow: boolean = false;
  private isClose: boolean = false;
  private url = require("@/assets/index/anjuan.png");
  created() {
    console.log(this.desItem);
  }
  showDetail() {
    if (this.isShow) {
      this.isClose = true;
      setTimeout(() => {
        this.isShow = !this.isShow;
        this.isClose = false;
      }, 500);
      return
    }
    this.isShow = !this.isShow;
  }
}
</script>
<style lang="scss">
#des-item {
  position: relative;
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
  box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.3);
  .btn {
    display: flex;
    align-items: center;
    > div:nth-of-type(1) {
      font-size: 22px;
      color: #8ebefe;
      text-decoration: underline;
    }
    > div:nth-of-type(2) {
      font-size: 22px;
      width: 78px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      background: #85b8fd;
      border-radius: 8px;
      margin-left: 54px;
    }
  }
  img {
    width: 119px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
  .details {
    position: absolute;
    right: 0;
    top: 270px;
    width: 240px;
    height: 230px;
    border-radius: 8px;
    color: #fff;
    font-size: 22px;
    background: #8ebefe;
    box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.59);
    z-index: 1;
    animation: isShow 0.5s;
  }
  @keyframes isShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .close {
    animation: isClose 0.5s;
  }
  @keyframes isClose {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
}
</style>