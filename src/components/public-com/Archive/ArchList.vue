<template>
  <div v-if="listData" id="arch-list">
    <!-- <button @click="onChecking">{{isChecking ? '全选' : '选择'}}</button> -->
    <ul class="list">
      <li v-for="(item, index) in listData" :key="item.fileId" class="list-item">
        <ListItem :itemData="item"  @onClick="canClickItem && passClickIndex([index])"/>
        <!-- 选择时的遮罩层 -->
        <label class="check-mask" @click="checkItem(index)" v-show="isChecking">
          <i class="check-circle" :class="{ 'checked-circle': checkList[index] }">✓</i>
        </label>        
      </li>
    </ul>
    <transition name="btns-move">
      <div v-show="isChecking" class="btns-box">
        <button v-if="canCancel" class="cancel-btn" @click="$emit('changeCheck', false)">取消</button>
        <button v-else class="delete-btn" @click="startEdit(false)">删除</button>
        <button class="edit-btn" @click="startEdit(true)">{{editName}}</button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Model } from 'vue-property-decorator'
import ListItem from './ListItem.vue'
import MsgBox from '../MsgBox/Msg';

@Component({
  components: {
    ListItem,
  }
})
export default class ArchList extends Vue {
  // 数据
  @Prop() listData!: Array<any>;
  // 功能
  @Prop({default: true}) canClickItem!: boolean;
  @Prop({default: '编辑'}) editName!: string;
  @Prop({default: true}) canCancel!: boolean;
  @Model('changeCheck') isChecking: boolean = false;

  private checkList: Array<boolean> = [];

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
  }
  checkItem(index: number) {
    // 如果直接修改数组内元素无效，官方文档响应式原理！
    this.$set(this.checkList, index, !this.checkList[index]);
  }
  startEdit(adding: boolean = true) {
    let checkedIndex: Array<number> = [];
    this.checkList.forEach((value, index) => {
      if (value) checkedIndex.push(index);
    });

    if (checkedIndex.length === 0) {
      MsgBox.error('请选择至少一个文件')
    }
    else {
      if (adding)
        this.passClickIndex(checkedIndex)
      else
        this.deleteClickIndex(checkedIndex)
    }
  }
  /* 告诉父组件点击了哪个元素 */
  @Emit('passClickIndex')
  passClickIndex(indexList: Array<number>) {
    return indexList;
  }
  /* 告诉父组件要删除哪些元素 */
  @Emit('deleteClickIndex')
  deleteClickIndex(indexList: Array<number>) {
    return indexList;
  }
}
</script>

<style lang="scss">
  #arch-list {
    .list {
      padding-bottom: 2rem; // 防止字溢出
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 30px;
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
            transition: all 0.15s ease-out;
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
      .edit-btn,
      .delete-btn {
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
      .delete-btn {
        background: #FFFFFF;
        color: rgba(255, 0, 0, 0.7);
        box-shadow: 0px 3px 7px 0px rgba(143, 143, 143, 0.35);
        border-radius: 8px;
      }
    }
    // btns-box的动画
    @import '~@/assets/css/animation/btns-move.scss';
  }
</style>