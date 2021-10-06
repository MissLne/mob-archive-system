<template>
  <ul class="select" v-show="isSpread">
    <li v-for="(item, index) in itemList" :key="item[optionVariableKey]" class="option-box">
      <div
        class="content"
        :style="{ 'padding-left': 0.75 + recursionTimes * 0.5 + 'rem' }"
      >
        <!-- 换成最外层监听了，原来在content里 -->
        <!-- @click="onOptionClick(index, item, $event)" -->
        {{item[optionVariableName]}}
      </div>
      <div v-if="item.children">
        <label class="pulldown-icon-wrap" @click="onSpreadIconClick(index)">
          <img
            src="@/assets/head/pulldown@2x.png"
            class="pulldown-icon"
            :style="{ 'transform': isChildrenSpread[index] ? 'rotateX(180deg)' : '' }"
          >
        </label>
        <SelectInner
          :myData="item.children"
          :isSpread="isChildrenSpread[index]"
          :recursionTimes = "recursionTimes + 1"
          :optionVariableName="optionVariableName"
          :optionVariableKey="optionVariableKey"
        />
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SelectInner extends Vue {
  @Prop() myData!: Array<any> | null;
  @Prop() typeName!: string;
  @Prop() isSpread!: boolean;
  @Prop() recursionTimes!: number;
  @Prop() optionVariableName!: string;
  @Prop() optionVariableKey!: string;
  private isChildrenSpread: Array<boolean> | null = null;
  get itemList() {
    return this.myData || null
  }
  private created() {
    if (this.itemList)
      this.isChildrenSpread = new Array(this.itemList.length).fill(true)
  }
  // 换成最外层监听了
  /* private onOptionClick(index: number, item: any, e: PointerEvent) {
    console.log('option is', item.typeName, e)
  } */
  private onSpreadIconClick(index: number) {
    if (this.isChildrenSpread)
      this.$set(this.isChildrenSpread, index, !this.isChildrenSpread[index]);
  }
  
}
</script>

<style lang="scss">
  .select {
    background: #8EBEFE;
    color: #FFF;
    .option-box {
      position: relative;
      .content {
        border-top: 1px solid rgba(255, 255, 255, 0.5);
        padding: 26px 70px 26px 0;
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          width: 100%;
        }
      }
      .pulldown-icon-wrap {
        position: absolute;
        top: 0;
        right: 0;
        width: 80px;
        height: 100%;
        .pulldown-icon {
          position: absolute;
          width: 27px;
          height: 15px;
          transition: transform 0.25s ease-out; // pulldown-arrow
        }
      }
    }
  }
</style>