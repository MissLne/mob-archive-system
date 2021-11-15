<template>
  <div id="des-btn">
    <div class="pageBtns">

      <div @click="prePageData(totalPage.current)" class="btn">上一页</div>
      <div>
        <p
          v-for="item in arr"
          :key="item"
          :style="{ color: totalPage.current == item ? '#85b8fd' : '#999' }"
          @click="changePageData(item)"
        >
          {{ item }}
        </p>
      </div>
      <div @click="nextPageData(totalPage.current)" class="btn">下一页</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit,Watch } from "vue-property-decorator";

interface Item {
  total: number;
  current: number;
}
@Component
export default class DesBtn extends Vue {
  private arr: Array<number> = [];
  @Prop({}) private totalPage!: Item;
  private page: number = 0;
  @Emit("changePage") prePage() {
    return { type: "prePage" };
  }
  @Emit("changePage") nextPage() {
    return { type: "nextPage" };
  }
  @Emit("changePage") clickPage(num: number) {
    return { type: "clickPage", page: num };
  }
  @Watch('totalPage',{immediate: true, deep: true}) watchArr(newVal: Item,oldVal: Item) {
    this.initPageData(newVal.total);
  }
  changePageData(page: number) {
    let temp = this.totalPage.current;
    this.clickPage(page);
    console.log("click", this.arr, this.arr[this.arr.length - 1]);
    if (
      (this.arr[this.arr.length - 1] == this.totalPage.total && temp < page) ||
      (this.arr[0] == 1 && (page == 2 || page == 3))
    )
      return;
    if (page < 3) {
      for (let i = 0; i <= 5; i++) {
        i == 5 ? this.arr.splice(i) : this.$set(this.arr, i, i + 1);
      }
      return;
    }
    for (let i = 0; i <= 5; i++) {
      i == 5 ? this.arr.splice(i) : this.$set(this.arr, i, page + i - 2);
    }
    this.arr.indexOf(this.totalPage.total) == -1
      ? this.arr
      : this.arr.splice(this.arr.indexOf(this.totalPage.total) + 1);
  }
  prePageData(page: number) {
    console.log("pre");
    this.prePage();
    if (this.totalPage.current >= 3 && this.arr[0] >= page - 2) {
      for (let i = 0; i < 6; i++) {
        i == 5 ? this.arr.splice(i) : this.$set(this.arr, i, page + i - 3);
      }
    }
  }
  nextPageData(page: number) {
    console.log("next");
    this.nextPage();
    page = this.totalPage.current;
    if (this.totalPage.current + 2 < this.totalPage.total && this.arr[0] < page - 2) {
      for (let i = 0; i < 5; i++) {
        if (page + i > this.totalPage.total) {
          this.arr.splice(i);
          return;
        }
        this.$set(this.arr, i, page + i);
      }
    }
  }
  initPageData(page: number) {
    console.log("w s sdsddfhsjf")
    
    let pageNum = page > 5 ? 5 : page;
    for (let i = 1; i <= pageNum; i++) {
      this.arr[i - 1] = i;
      this.$set(this.arr,i - 1,i)
    }
    this.arr.splice(pageNum)
  }
  created() {
    this.initPageData(this.totalPage.total);
  }
}
</script>
<style lang="scss">
#des-btn {
  margin: 50px 0 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .pageBtns {
    .btn {
      width: 78px;
      height: 38px;
      border-radius: 8px;
      background: #85b8fd;
      color: #fff;
      font-size: 18px;
      text-align: center;
      line-height: 38px;
      box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
    }
    display: flex;
    justify-content: center;
    align-content: center;
    div {
      font-size: 6px;
      line-height: 38px;
      height: 38px;
      display: flex;
      justify-content: space-between;
      align-content: center;
      p {
        margin: 0 18px;
      }
    }
  }
}
</style>