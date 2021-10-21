<template>
  <div class="input-wrap">
    <input
      :type="type"
      :disabled="disabled"
      class="input"
      :class="{ 'active': isActive, 'wrong': required && isWrong }"
      :value="outerValue"
      v-on="inputListeners"
      @focus="onFocus"
      @blur="onBlur"
    >
    <div
      v-if="type === 'text'"
      class="holder-box"
      :class="{ 'holder-box-hidden': !isEmpty || isActive || showOnce }"
    >{{holder}}</div>
    <div
      v-if="required"
      class="wrong-box"
      :class="{ 'wrong-box-hidden': !isWrong }"
    >{{msg}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'

@Component
export default class Input extends Vue {
  @Prop({default: 'text'}) type!: string;
  @Prop({default: false}) disabled!: boolean;
  @Prop({default: false}) required!: boolean;
  @Prop({default: '无'}) holder!: string;
  @Prop({default: ''}) msg!: string;
  @Model('change', {type: String}) outerValue!: string;

  isActive: boolean = false;
  isWrong: boolean = false;
  showOnce: boolean = false;

  get inputListeners() {
    const vm = this;
    return Object.assign({}, this.$listeners, {
      change: function (e: any) {
        vm.$emit('change', e.target.value)
      }
    })
  }

  get isEmpty() {
    return !this.outerValue;
  }

  // 是否输入完成
  private get complete(): boolean {
    return !this.isEmpty && !this.isEmpty;
  }
  // 输入栏聚焦
  private onFocus() {
    this.isActive = true, this.isWrong = false;
    if (this.required) this.showOnce = true;
  }
  // 输入栏失焦
  private onBlur() {
    this.isActive = false;
    if (this.isEmpty) this.isWrong = true;
  }
}
</script>

<style lang="scss" scoped>
  .input-wrap {
    $width: 430px;
    $height: 73px;
    $holder-color: rgba(102, 102, 102, 1);
    z-index: 1;
    position: relative;
    width: $width;
    height: $height;
    box-sizing: border-box;
    margin-bottom: 3px;
    font-size: 28px;
    .input {
      width: 100%;
      height: 100%;
      border: none;
      border-bottom: 3px solid #E1E1E1;
      padding: 0;
      background-color: transparent;
      color: $holder-color;
      line-height: $height;
      transition: border-color 0.15s ease-in, color 0.25s ease-in;
      &.username {
        margin-bottom: 95px;
      }
      &.password {
        margin-bottom: 31px;
      }
    }
    .active {
      border-color: rgba(0, 79, 255, 0.2);
      color: rgba(0, 79, 255, 0.5);
      transition-timing-function: ease-out;
    }
    .holder-box {
      z-index: -1;
      position: absolute;
      bottom: 23px;
      // left: 50%;
      color: $holder-color;
      // transform: translateX(-50%);
      transition: opacity 0.35s ease-out;
    }
    .wrong {
      border-color: rgba(255, 0, 0, 0.2);
      transition-timing-function: ease-out;
    }
    .wrong-box {
      z-index: -1;
      position: absolute;
      bottom: 23px;
      // left: 50%;
      color: rgba(255, 0, 0, 0.5);
      // transform: translateX(-50%);
      transition: opacity 0.35s ease-out;
    }
    .holder-box-hidden,
    .wrong-box-hidden {
      opacity: 0;
      transition: none;
    }
  }
</style>