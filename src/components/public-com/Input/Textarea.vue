<template>
  <div
    :contenteditable="!disabled"
    :class="{ 'disabled': disabled, 'wrong': isWrong }"
    class="textarea"
    @focus="onFocus"
    @blur="onBlur"
    v-text="shownText"
  ></div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
@Component
export default class Textarea extends Vue {
  @Model('pseudoChange', { default: '' }) value!: string;
  // 模仿change的blur
  onBlur({ target: { innerText } }: any) {
    this.isActive = false;
    // 去首尾的空格
    innerText = innerText.trim();
    // 如果必填项空着就报个错
    if (this.required && innerText === '')
      this.isWrong = true;
    // 如果没变就不emit了，模仿change
    if (innerText === this.value)
      return;
    this.$emit('pseudoChange', innerText);
  }
  onFocus() {
    this.isActive = true;
    this.isWrong = false;
  }

  get shownText() {
    if (!this.isActive) {
      if (this.isWrong)
        return this.errorMsg;
      else if (!this.value)
        return '无';
    }
    return this.value;
  }

  // 是否必填
  @Prop({ default: false }) required!: boolean;
  // 错误提示语
  @Prop({ default: '该项为必填项' }) errorMsg!: string;
  // 是否禁用
  @Prop({ default: false }) disabled!: boolean;
  // 用于控制holder
  isActive: boolean = false;
  // 控制错误提示
  isWrong: boolean = false;
}
</script>

<style lang="scss" scoped>
  .textarea {
    $holder-color: rgba(102, 102, 102, 1);
    $active-color: rgba(0, 79, 255, 0.5);
    $disabled-color: #bbb;
    $line-height: 50px;
    $font-size: 30px;
    overflow-y: auto;
    width: 430px;
    // 1-3行 + 底边
    min-height: calc(#{$line-height} + 3px);
    max-height: calc(#{$line-height} * 3 + 23px);

    border: none;
    border-bottom: 3px solid #E1E1E1;
    padding: calc((#{$line-height} - #{$font-size}) / 2) 0;

    color: $holder-color;
    font-size: $font-size;
    line-height: $line-height;
    text-align: start;
    overflow-wrap: break-word;

    box-sizing: border-box;
    outline: none;
    transition: all 0.3s;
    &:focus {
      // 4-5行 + 底边
      min-height: calc(3 * #{$line-height} + 23px);
      max-height: calc(5 * #{$line-height} + 23px);

      border-color: rgba(0, 79, 255, 0.2);
      color: $active-color;
      transition-timing-function: ease-out;
    }
    &.disabled {
      color: $disabled-color;
    }
    &.wrong {
      border-color: rgba(255, 0, 0, 0.2);
      color: rgba(255, 0, 0, 0.5);
    }
  }
</style>