<template>
  <div v-if="listData" id="arch-list">
    <!-- <button @click="onChecking">{{isChecking ? '全选' : '选择'}}</button> -->
    <ul class="list">
      <li v-for="(item, index) in listData" :key="item.fileId" class="list-item">
        <ArchItem :itemData="item"  @onClick="passClickIndex([index])"/>
        <!-- 选择时的遮罩层 -->
        <label class="check-mask" @click="checkItem(index)" v-show="isChecking">
          <i class="check-circle" :class="{ 'checked-circle': checkList[index] }">✓</i>
        </label>        
      </li>
    </ul>
    <transition name="btns-move">
      <div v-show="isChecking" class="btns-box">
        <button class="cancel-btn" @click="stopSelect">取消</button>
        <button class="edit-btn" @click="startEdit">编辑</button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import ArchItem from '@/components/temp-arch-com/ArchItem.vue'
import MsgBox from './MsgBox/Msg';

@Component({
  components: {
    ArchItem,
  }
})
export default class ArchList extends Vue {
  @Prop() listData!: Array<any>;
  private checkList: Array<boolean> = [];
  public isChecking: boolean = false;

  /* 选择文件部分 */
  onChecking() {
    if (this.checkList.length !== this.listData.length)
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
  @Emit('stopSelect')
  stopSelect() {
    this.isChecking = false;
  }
  startEdit() {
    let checkedIndex: Array<number> = [];
    this.checkList.forEach((value, index) => {
      if (value) checkedIndex.push(index);
    });

    if (checkedIndex.length === 0) {
      MsgBox.error('请选择至少一个文件')
    }
    else {
      this.passClickIndex(checkedIndex)
      this.isChecking = false;
    }
  }
  /* 告诉父组件点击了哪个元素 */
  @Emit('passClickIndex')
  passClickIndex(indexList: Array<number>) {
    return indexList;
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
          height: calc(100% + 32px); //标题也要覆盖。。
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
    .btns-box {
      position: fixed;
      bottom: 29px;
      left: 115px;
      display: flex;
      justify-content: space-between;
      width: 520px;
      .cancel-btn,
      .edit-btn {
        width: 162px;
        height: 75px;
        border: none;
        font-size: 42px;
        text-align: center;
        line-height: 75px;
      }
      .cancel-btn {
        background: #FFFFFF;
        color: #85B8FD;
        box-shadow: 0px 3px 7px 0px rgba(143, 143, 143, 0.35);
        border-radius: 8px;
      }
      .edit-btn {
        background: #85B8FD;
        color: #FFFFFF;
        box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
        border-radius: 8px;
      }
      // 动画
      &.btns-move-enter,
      &.btns-move-leave-to {
        transform: translateY(150px);
      }
      &.btns-move-enter-active {
        transition: transform 0.35s ease-out;
      }
      &.btns-move-leave-active {
        transition: transform 0.25s ease-in;
      }
      &.btns-move-enter-to,
      &.btns-move-left {
        transform: translateY(0px);
      }
    }
    
  }
</style>