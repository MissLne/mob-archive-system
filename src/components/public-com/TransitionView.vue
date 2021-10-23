<template>
  <transition :name="transitionName">
    <slot><!-- router-view的位置 --></slot>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class TransitionView extends Vue {
  private transitionName: string = '';
  @Watch('$route')
  watchSlotRoute(to: any, from: any) {
    // 刚打开登录页面的时候，from为null，会有谜之动画
    if (from.name === null) return;
    else if (from.name === 'login') {
      this.transitionName = 'slide-left';
      return;
    }
    else if (to.name === 'login') {
      this.transitionName = 'slide-right';
      return;
    }

    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    // console.log(to.name, from)
    // console.log(toDepth, fromDepth)
    if (toDepth === fromDepth) this.transitionName = ''
    else this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }

}
</script>

<style lang="scss">
  .router-view-wrapper {
    overflow: scroll;
    height: 100vh;
  }
</style>