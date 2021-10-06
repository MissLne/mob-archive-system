<template>
  <div v-if="listData" id="arch-list">
    <button @click="onChecking">{{isChecking ? '全选' : '选择'}}</button>
    <button @click="stopSelect">取消选择模式</button>
    <ul class="list">
      <li v-for="(item, index) in listData" :key="item.id" class="list-item">
        <ArchItem :itemData="item"  @onClick="passClickIndex(index)"/>
        <!-- 选择时的遮罩层 -->
        <label class="check-mask" @click="checkItem(index)" v-show="isChecking">
          <i class="check-circle" :class="{ 'checked-circle': checkList[index] }">✓</i>
        </label>        
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import ArchItem from '@/components/temp-arch-com/ArchItem.vue'

@Component({
  components: {
    ArchItem,
  }
})
export default class ArchList extends Vue {
  @Prop() listData!: Array<any>;
  private checkList: Array<boolean> = [];
  private isChecking: boolean = false;

  /* 选择文件部分 */
  onChecking() {
    if (!this.checkList.length)
      this.checkList = new Array(this.listData.length).fill(false);
    // 全选
    if (this.isChecking) {
      if (this.checkList.includes(false))
        this.checkList.forEach((value, index) => 
          this.$set(this.checkList, index, true))
      else
        this.checkList.forEach((value, index) => 
          this.$set(this.checkList, index, false))
    }
    else
      this.isChecking = true;
  }
  checkItem(index: number) {
    // 如果直接修改数组内元素无效，官方文档响应式原理！
    this.$set(this.checkList, index, !this.checkList[index]);
    // console.log(this.checkList)
  }
  stopSelect() {
    this.isChecking = false;
  }

  /* 告诉父组件点击了哪个元素 */
  @Emit('passClickIndex')
  passClickIndex(index: number) {
    // this.$emit('passClickIndex', index);
    return index;
  }
}
</script>

<style lang="scss">
  #arch-list {
    .list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 63px;
      column-gap: 45px;
      .list-item {
        position: relative;
        .check-mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          .check-circle {
            position: absolute;
            top: 10px;
            right: 10px;
            box-sizing: border-box;
            width: 47px;
            height: 47px;
            border: 4px solid #D1E5FE;
            border-radius: 50%;
            color: transparent;
            font-weight: bold;
            text-align: center;
            line-height: 45px;
          }
          .checked-circle {
            border-color: #89BCFE;
            color: #89BCFE;
          }
        }
      }
    }
  }
</style>