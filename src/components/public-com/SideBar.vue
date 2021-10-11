<template>
  <div id="side-bar" :style="{transform: sideBarShow? 'scaleX(1)' : 'scaleX(0)'}">
    <div class="side-bar-top">
      <div>临时档案</div>
      <div>回收站</div>
    </div>
    <div class="side-bar-foot">退出登录</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SideBar extends Vue {
  @Prop({}) private sideBarShow!: boolean
}
</script>

<style lang="scss">
#side-bar {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  font-size: 32px;
  z-index: 999;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 522px;
  height: calc(100vh - 124px);
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