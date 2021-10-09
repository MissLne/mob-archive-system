<template>
  <div id="des-head">
    <div class="des">
      <div class="sideBar" @click="leftClick">
        <div v-if="!headData.leftPic">{{ headData.leftText }}</div>
        <img :src="pics[headData.leftUrl]" v-if="headData.leftPic" />
      </div>
      <div class="title">{{ headData.title }}</div>
      <div class="choice" @click="rightClick">
        <div v-if="!headData.rightPic">{{ headData.rightText }}</div>
        <img :src="pics[headData.rightUrl]" v-if="headData.rightPic" />
      </div>
      <div class="popUp" v-if="headData.isShow" :class="{'isClose': isClose}">
        <div v-for="(item, index) in popArr" :key="index" @click.prevent="popUpClick(index)">{{ item }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

interface Information {
  title: string;
  leftUrl: string;
  rightUrl: string;
  leftPic: boolean;
  rightPic: boolean;
  leftText: string;
  rightText: string;
  isShow: boolean;
  [key: string]: string | boolean;
}
interface strObj {
  [key: string]: string;
}
@Component
export default class DesHead extends Vue {
  @Prop({}) private headData!: Information;
  @Prop({}) private popArr!: string[];
  private isClose: boolean = false
  private pics: strObj = {
    1: require("@/assets/head/back@2x.png"), //返回
    2: require("@/assets/head/moreright@2x.png"), //右侧边栏
    3: require("@/assets/head/more@2x.png"), //左侧边栏
    4: require("@/assets/head/chacha@2x.png"), //叉号
  };
  created() {}
  popUpClick(index: number) {
    if(index === 1) this.rightClick(1)
  }
  leftClick() {
    this.$emit("handleClick", { clickType: "left" });
  }
  rightClick(e?: number) {
    if(e && e === 1) this.$emit("handleClick", { clickType: "right",show: true });
     if (this.headData.isShow) {
       this.isClose = true;
        setTimeout(() => {
             this.isClose = false;
        }, 400)
      }
    this.$emit("handleClick", { clickType: "right"});
  }
}
</script>
<style lang="scss">
#des-head {
  z-index: 99;
  width: 750px;
  height: 124px;
  position: fixed;
  top: 0;
  left: 0;
  .title {
  width: 270px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
}

.des {
  position: relative;
  width: 750px;
  height: 124px;
  font-size: 36px;
  padding: 35px 33px 0 33px;
  color: #fff;
  background: linear-gradient(to bottom, #7aaffa 0%, #8cbffe 100%);
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:nth-of-type(3) {
    justify-content: flex-end;
  }
  > div:nth-of-type(1),
  div:nth-of-type(3) {
    height: 80px;
    width: 80px;
    display: flex;
    align-items: center;
    font-size: 26px;
    img {
      width: 36px;
      // height: 23px;
    }
  }
  .popUp {
    position: absolute;
    top: 130px;
    right: 19px;
    width: 253px;
    height: 173px;
    border-radius: 20px;
    background: #8ebefe;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    animation: isShow .5s;
    box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.59);
    div {
      font-size: 32px;
      box-sizing: border-box;
      line-height: 86.5px;
      text-align: center;
      height: 86.5px;
      width: 200px;
      border-top: 1px solid rgba(255, 255, 255, 0.8);
    }
    > div:nth-of-type(1) {
      border: none;
    }
  }
  .isClose {
    animation: close .5s;
  }
  @keyframes close {
     from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @keyframes isShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>