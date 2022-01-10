<template>
  <div class="input-wrap">
    <input
      :type="type"
      :disabled="disabled"
      class="input"
      :class="{ 'active': isActive, 'wrong': required && isWrong }"
      :value="outerValue"
      v-on="inputListeners"
      :autocomplete="$attrs.autocomplete"
      @focus="onFocus"
      @blur="onBlur"
    >
    <div
      class="holder-box"
      :class="{ 'holder-box-hidden': !isEmpty || isActive || isWrong }"
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
  // 是否禁用
  @Prop({default: false}) disabled!: boolean;
  // 是否必选
  @Prop({default: false}) required!: boolean;
  // placeholder
  @Prop({default: '无'}) holder!: string;
  // 必选消息为空时的消息
  @Prop({default: ''}) msg!: string;
  @Model('change', {type: [String, Number]}) outerValue!: string | number;

  public isActive: boolean = false;
  public isWrong: boolean = false;

  get inputListeners() {
    const vm = this;
    return Object.assign({}, this.$listeners, {
      change: function ({ target: { value } }: any) {
        vm.$emit('change', value)
      }
    })
  }

  get isEmpty() {
    return !this.outerValue;
  }

  // 是否输入完成
  private get complete(): boolean {
    return !this.isEmpty;
  }
  // 输入栏聚焦
  private onFocus() {
    this.isActive = true, this.isWrong = false;
  }
  // 输入栏失焦
  private onBlur() {
    this.isActive = false;
    if (this.isEmpty) this.isWrong = true;
  }
  // 父元素的聚焦监听器
  get parentFocus() {
    return Object.assign(this.onFocus, this.$listeners)
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
      box-sizing: border-box;
      border: none;
      border-bottom: 3px solid #E1E1E1;
      padding: 0;
      background-color: transparent;
      color: $holder-color;
      line-height: $height;
      // color用于disabled的变色
      transition:
        border-color 0.15s ease-in,
        color 0.25s ease-in;

      // 禁用的时候，改颜色！
      &:disabled,
      &:disabled + div {
        color: #bbb;
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
      color: $holder-color;
      transition: 
        opacity 0.35s ease-out,
        color 0.35s ease-out;
      // color用于disabled的变色
    }
    .wrong {
      border-color: rgba(255, 0, 0, 0.2);
      transition-timing-function: ease-out;
    }
    .wrong-box {
      z-index: -1;
      position: absolute;
      bottom: 23px;
      color: rgba(255, 0, 0, 0.5);
      transition: opacity 0.35s ease-out;
    }
    .holder-box-hidden,
    .wrong-box-hidden {
      opacity: 0;
      transition: none;
    }
  }
</style>