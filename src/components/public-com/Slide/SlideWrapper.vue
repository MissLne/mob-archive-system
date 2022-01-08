<template>
<!-- 参考https://www.bilibili.com/video/BV1YU4y177wa -->
<!-- 视口，100vw -->
<div class="slide-wrapper">
  <!-- 滑动窗口，长度3 * 100vw -->
  <div
    :style="{transform: `translateX(${
      this.dynamicBox ?
      -100 + movePercentage * 100 :
      -indexList[1] * 100 + movePercentage * 100
    }%)`}"
    class="flex-wrapper"
    :class="{ 'tween': isTween }"
    @touchstart="onTouchstart"
    @touchmove="onTouchmove"
    @touchend="onTouchend"
  >
    <div v-show="dynamicBox && stopGoLeft" style="width: 100vw;"></div>
    <slot></slot>
    <div v-show="dynamicBox && stopGoRight" style="width: 100vw;"></div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'

@Component
export default class SlideWrapper extends Vue {
  @Prop({ default: 0 }) maxLength!: number
  // 内部的盒子是否动态变化的盒子
  @Prop({ default: false }) dynamicBox!: boolean
  //大概是一个矫揉造作的变量
  @Prop({ default: false }) isCurCle!: boolean
  @Prop({}) showNumber!: number
  /* @Watch('maxLength') a() {
    console.log('长度变惹')
  } */

  startX: number = 0;
  startY: number = 0;
  // 为了算速度
  startTime: Date = new Date();
  endX: number = 0;
  movePercentage: number = 0;
  isLeftRight: any = null;
  isTween = false;
  indexList: Array<number> = [0, 0, 0];

  // 禁止向左走和向右走
  get stopGoLeft() { return this.indexList[0] === -1; }
  get stopGoRight() { return this.indexList[2] === -1; }

  onTouchstart({ touches }: TouchEvent) {
    if (touches.length === 1) {
      this.startX = touches[0].clientX;
      this.startY = touches[0].clientY;
      this.startTime = new Date();
    }
  }
  onTouchmove(e: TouchEvent) {
    if (e.touches.length === 1) {
      // 设定方向，一旦设定end后才会重置
      if (this.isLeftRight === null) {
        this.isLeftRight = Math.abs(e.touches[0].clientX - this.startX) > Math.abs(e.touches[0].clientY - this.startY);
        // 不prevent好像也可以实现，左右的时候不能上下。。
        // if (this.isLeftRight) e.preventDefault();
      }
      if (this.isLeftRight) {
        this.endX = e.touches[0].clientX;
        this.movePercentage = (e.touches[0].clientX - this.startX) / window.innerWidth;
      }
    }
  }
  onTouchend(e: TouchEvent, outsidePercentage?: number) {
    if (outsidePercentage)
      this.movePercentage = outsidePercentage;
    if (this.isLeftRight) {
      if ((0.4 < Math.abs(this.movePercentage) && Math.abs(this.movePercentage) <= 1) ||
        Math.abs(this.endX - this.startX) / ((new Date() as any) - (this.startTime as any)) > 1.5) {
        if (this.movePercentage > 0)
          this.movePercentage = this.stopGoLeft ? 0 : 1;
        else
          this.movePercentage = this.stopGoRight ? 0 : -1;
      }
      else
        this.movePercentage = 0;

      // 不然垂直滚动完会有延迟- -  
      this.isTween = true;
      // 与补间动画0.3s同步（本来使用transitionend，因为input的动画也会冒泡触发，担心性能问题）
      setTimeout(() => {
        this.setPages(this.movePercentage);
        this.movePercentage = 0;
        this.isTween = false;
      }, 300)
    }
    this.isLeftRight = null;
  }
  @Emit("setPages")
  public setPages(go: number) {
    
    const now = this.indexList[1] - go;

    this.indexList = [
      now === 0 ? -1 : now - 1,
      now,
      now === this.maxLength - 1 ? -1 : now + 1
    ]
    this.$emit('setPages', { corect: go})
    return this.indexList;
  }
  created() {
    console.log(this.$store.state.applyIdIndex,"+++++++++++++",this.$store.state)
    if(this.isCurCle) this.indexList[1] = this.$store.state.applyIdIndex
    this.setPages(0);
  }
}
</script>

<style lang="scss" scoped>
.slide-wrapper {
  overflow-x: hidden;
  width: 100vw;
  .flex-wrapper {
    display: flex;
    height: 100vh;
    > * {
      flex-shrink: 0;
      transform: translate(0%);
    }
  }
}
.tween {
  transition: transform 0.3s;
}
</style>