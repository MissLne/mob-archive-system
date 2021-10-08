<template>
  <transition name="move">
    <div
      v-show="isShow"
      class="msg-box"
      :class="{ 'success': isSuccess }"
    >
      {{showMsg}}
    </div>
  </transition>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  interface BoxData {
    showMsg: string;
    isSuccess: boolean;
    isShow: boolean;
  }
  @Component
  export default class MsgBox extends Vue {
    showMsg: string = '';
    isSuccess: boolean = false;
    isShow: boolean = false;
  }
</script>

<style lang="scss" scoped>
  .msg-box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 100;
    bottom: 199px;
    left: 50%;
    width: 568px;
    height: 75px;
    background-color: #FE8E8E;

    color: #FFF;
    font-size: 35px;
    font-family: PingFang SC;
    
    box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
    border-radius: 38px;

    transition: background-color 0.25s;

    transform: translateX(-50%);
  }
  .move-enter,
  .move-leave-to {
    bottom: -80px;
  }
  .move-enter-to,
  .move-leave {
    bottom: 199px;
  }
  .move-enter-active {
    // animation: move 0.5s ease-out forwards,
    transition: all 0.5s;
  }
  .move-leave-active {
    // animation: move 0.3s ease-out forwards reverse;
    transition: all 0.5s;
  }
  .success {
    background-color: #8EBEFE;
  }
</style>