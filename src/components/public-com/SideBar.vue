<template>
  <div id="side-bar" :style="{transform: sideBarShow? 'translateX(0)' : 'translateX(-100%)'}">
    <div class="side-bar-top">
      <!-- <div>临时档案</div> -->
      <router-link :to="{ name: 'tempArchUpload' }" tag="div">临时档案</router-link>
      <!-- <div>回收站</div> -->
      <router-link :to="{ name: 'recycleBin' }" tag="div">回收站</router-link>
    </div>
    <div class="side-bar-foot" @click="logout">退出登录</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MsgBox from "./MsgBox/Msg";

@Component
export default class SideBar extends Vue {
  @Prop({}) private sideBarShow!: boolean
  logout() {
    localStorage.clear();
    this.$router.go(-1);
    setTimeout(() => {
      MsgBox.success('退出登录成功');
    }, 450)
  }
}
</script>

<style lang="scss">
#side-bar {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  font-size: 32px;
  z-index: 1000;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 522px;
  min-height: calc(100% - 124px);
  background: #fff;
  box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.15);
  transition: .6s;
  transform-origin: left;
  .side-bar-top {
    div {
      width: 452px;
      height: 90px;
      box-sizing: border-box;
      text-align: center;
      line-height: 90px;
      margin: 0 auto;
      color: #555555;
      border-bottom: 1px solid rgba(4, 0, 0, 0.1);
    }
  }
  .side-bar-foot {
    width: 452px;
    height: 90px;
    box-sizing: border-box;
    text-align: center;
    line-height: 90px;
    margin: 0 auto;
    color: #8ebefe;
    border-top: 1px solid rgba(4, 0, 0, 0.1);
  }
}
</style>