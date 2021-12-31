<template>
  <div id="alerts">
    <div class="box">
      <div class="title">{{ title }}</div>
      <div class="btn">
        <div @click="not">否</div>
        <div @click="sure">是</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Alerts extends Vue {
  @Prop() private title!: string;
  /* @Prop() private sureHandle!: () => void;
  @Prop() private notHandle!: () => void;

  created() {
    if (this.sureHandle) this.sure = this.sureHandle;
    if (this.notHandle) this.not = this.notHandle;
  } */

  not() {
    this.$emit('sureDelete',{type: 'not'})
  }
  sure() {
    this.$emit('sureDelete',{type: 'sure'})
  }
}
</script>
<style lang="scss">
#alerts {
  font-size: 34px;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  
  display: flex;
  justify-content: center;
  align-items: center;
  .title {
      line-height: 113px;
      text-align: center;
    }
  .box {
    box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
    border-radius: 8px;
    z-index: 1001;
    color: #444;
    width: 449px;
    height: 213px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    .btn {
      border-top: 1px solid #e5e5e5;
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        font-size: 36px;
        width: 50%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      > div:nth-of-type(2) {
        color: #ff0000;
        border-left: 1px solid #e5e5e5;
      }
    }
  }
}
</style>