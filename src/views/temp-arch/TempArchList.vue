<template>
  <div id="temp-arch-list">
    <button @click="getTempArchList">加载</button>
    <button @click="onChecking">{{isChecking ? '全选' : '选择'}}</button>
    <button @click="stopSelect">取消选择模式</button>

    <ul class="list">
      <li v-for="(item, index) in listData" :key="item.id" class="list-item">
        <ArchItem :itemData="item"  @onClick="navToDetail(index)"/>
        <!-- 选择时的遮罩层 -->
        <label class="check-mask" @click="checkItem(index)" v-show="isChecking">
          <i class="check-circle" :class="{ 'checked-circle': checkList[index] }">✓</i>
        </label>        
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ArchItem from '@/components/temp-arch-com/ArchItem.vue'

@Component({
  components: {
    ArchItem,
  }
})
export default class TempArchList extends Vue {
  /* 请求列表数据部分 */
  private listData: Array<any> = [];
  private checkList: Array<boolean> = [];
  getTempArchList() {
    
    (this as any).$service.get('/api/api/archive/selectTemporaryArchive')
    .then((res: any) => {
      console.log(res)
      res = res.data.data;
      this.listData = res;
      this.checkList = new Array(res.length).fill(false);
    })
    .catch((err: any) => {
      console.log(err)
    })
  }

  /* 跳转详情页 */
  navToDetail(index: number) {
    this.$router.push({ name: 'collect-detail' });
    this.$emit('navToDetail', this.listData[index]);
  }

  /* 选择文件部分 */
  private isChecking: boolean = false;
  checkItem(index: number) {
    // 如果直接修改数组内元素无效，官方文档响应式原理！
    this.$set(this.checkList, index, !this.checkList[index]);
  }
  onChecking() {
    // 全选
    if (this.isChecking) {
      if (this.checkList.includes(false))
        this.checkList.forEach((value, index) => {
          this.$set(this.checkList, index, true);
        })
      else
        this.checkList.forEach((value, index) => {
          this.$set(this.checkList, index, false);
        })
    }
    else
      this.isChecking = true;
  }
  stopSelect() {
    this.isChecking = false;
  }
}
</script>

<style lang="scss">
  #temp-arch-list {
    margin: 0 5px;
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