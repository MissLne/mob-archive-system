<template>
  <!-- 用于保证点得到 -->
  <div
    ref="select-wrapper"
    class="select-wrapper"
    :style="{ 'z-index': isSpread ? 5 : 1 }"
    :class="{ 'show-higher': isSpread && isOverflow }"
    @click="myData && onWrapperClick($event)"
  >
    <div v-if="!myData" class="no-data-box disabled-color-transition" :class="{'disabled-color': disabled}">暂无数据</div>
    <div v-else class="have-data-box">
      <!-- 点击空白区域关闭的蒙版 -->
      <div class="mask" v-show="isSpread" @click.stop="isSpread = false"></div>
      <!-- 显示选择结果 -->
      <span class="selected-result disabled-color-transition" :class="{'disabled-color': disabled}">
        {{selectedString === '' ? '无' : selectedString}}
      </span>
      <!-- 选择部分 -->
      <transition name="spread">
        <div v-if="myData" v-show="!disabled && isSpread" class="select-inner">
          <!-- 动画是通过max-height实现，如果最外层Select没有一直显示的话，动画会直接结束！因此isSpread=true -->
          <SelectInner
            :myData="myData"
            :isSpread="true"
            :recursionTimes="0"
            :optionVariableName="optionVariableName"
            :optionVariableKey="optionVariableKey"
            @click.native.stop="catchBubble"
          />
        </div>
      </transition>
    </div>
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
  @Prop({default: false}) disabled!: boolean;
  @Prop() myData!: Array<any> | null;
  @Prop() optionVariableName!: string;
  @Prop() optionVariableKey!: string;
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
    position: relative;
    top: -3px; // 不加这个过渡动画失效
    left: 0;
    width: 430px;
    font-size: 28px;
    height: 100%;
    transition: top 0.25s ease-out;
    .mask {
      // z-index: -1; 由于书写顺序不需要z-index
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
    }
    .no-data-box {
      position: absolute;
      top: 23px;
      left: 0;
      color: rgba(102, 102, 102, 1);
    }
    .have-data-box {
      height: 100%;
      .selected-result {
        z-index: -1;
        position: absolute;
        top: 23px;
        left: 0;
        width: 430px;
        height: 100%;
        // background-color: #fff; // 为了子元素的mix-blend-mode
        color: rgba(102, 102, 102, 1);
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
        position: absolute;
        left: -24px;
        overflow: auto;
        max-height: 300px;
        box-shadow: 4px 3px 7px 0px rgba(76, 108, 174, 0.59);
      }
      .select-inner>.select>.option-box:first-of-type>.content {
        border: none;
      }
    }
  }
  // 禁用文本的颜色
  .disabled-color {
    color: #bbb !important;
  }
  // 禁用文本变色过渡效果
  .disabled-color-transition {
    transition: color 0.35s ease-out;
  }
  // 动画
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