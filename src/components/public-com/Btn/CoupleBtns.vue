<template>
  <div class="couple-btns">
    <button
      :class="{ 'left-btn': !colorReversal, 'right-btn': colorReversal }"
      @click="leftClick"
    >{{leftName}}</button>
    <button
      :class="{ 'left-btn': colorReversal, 'right-btn': !colorReversal }"
      @click="rightClick"
    >{{rightName}}</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

@Component
export default class CoupleBtns extends Vue {
  @Prop() leftName!: string;
  @Prop() rightName!: string;
  // 是否反转颜色。。为了回收站才加的呜呜
  @Prop({default: false}) colorReversal!: boolean;

  @Emit('leftClick')
  leftClick() {}

  @Emit('rightClick')
  rightClick() {}
}
</script>

<style lang="scss" scoped>
  .couple-btns {
    display: flex;
    justify-content: space-between;
    font-size: 42px;
    .left-btn,
    .right-btn {
      width: 162px;
      height: 75px;
      border: none;
      border-radius: 8px;
      transition: background-color 0.15s ease-out;
    }
    .left-btn {
      background-color: #fff;
      color: rgba(255, 0, 0, 0.7);
      box-shadow: 0px 3px 7px 0px rgba(143, 143, 143, 0.35);
      &:active {
        background-color: hsl(0, 0%, 97%);
      }
    }
    .right-btn {
      background-color: #85B8FD;
      color: #fff;
      box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
      &:active {
        background-color: hsl(215, 97%, 71%);
      }
    }
  }
</style>