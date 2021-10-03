<template>
  <!-- 用于保证点得到 -->
  <div
    ref="select-wrapper"
    class="select-wrapper"
    :class="{ 'show-higher': isSpread && isOverflow }"
    @click="onWrapperClick"
  >
    <div class="mask" v-show="isSpread" @click.stop="isSpread = false"></div>
    <transition name="spread">
      <div class="select-inner" v-show="isSpread">
        <!-- 动画是通过max-height实现，如果最外层Select没有一直显示的话，动画会直接结束！因此isSpread=true -->
        <SelectInner
          :myData="myData"
          :isSpread="true"
          :recursionTimes="0"
          @click.native.stop="catchBubble"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Model, Prop, Vue } from 'vue-property-decorator'
import SelectInner from './SelectInner.vue';

@Component({
  components: {
    SelectInner
  }
})
export default class Select extends Vue {
  @Model('catchBubble') selectedString!: string;
  @Prop() myData!: Array<any> | null;
  private isSpread: boolean = false;
  private isOverflow: boolean = false;
  onWrapperClick() {
    this.isSpread = !this.isSpread;
    const ele = this.$refs['select-wrapper'];
    if (this.isSpread) {
      const scale = window.innerWidth / 750;
      const bottom = (ele as HTMLElement).getBoundingClientRect().top + 300 * scale;
      if (window.innerHeight < bottom)
        this.isOverflow = true;
      else
        this.isOverflow = false;
    }
  }
  catchBubble({target}: {target: HTMLDivElement}) {
    if (target.innerText) {
      console.log('click!', target.innerText)
      this.$emit('catchBubble', target.innerText)
      this.isSpread = false;
    }
  }
}
</script>

<style lang="scss">
  .select-wrapper {
    z-index: 100;
    position: relative;
    left: -24px;
    // top: -3px;
    width: 484px;
    font-size: 28px;
    height: 100%;
    transition: top 0.25s ease-out;
    .mask {
      z-index: -1;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      // background-color: rgba(255, 255, 255, 0.3);
    }
    .pulldown-icon {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 27px;
      height: 15px;
      transition: transform 0.25s ease-out;
    }
    .select-inner {
      overflow: auto;
      max-height: 300px;
      box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.59);
    }
    .select-inner>.select>.option-box:first-of-type>.content {
      border: none;
    }
  }
  .show-higher {
    top: calc(-250rem / 32);
  }
  .spread-enter-active {
    animation: spread 0.25s ease-out;
  }
  .spread-leave-active {
    animation: spread 0.25s ease-out reverse;
  }
  @keyframes spread {
    from { opacity: 0; max-height: 0; }
    to { opacity: 1; max-height: 300px; }
  }
</style>