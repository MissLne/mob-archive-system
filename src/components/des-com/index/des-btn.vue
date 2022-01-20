<template>
  <div id="des-btn">
    <div @click="prePageData(pageCur)" class="pagebtn">上一页</div>
    <div class="container">
      <p
        v-for="item in arr"
        :key="item"
        :style="{ color: pageCur == item ? '#85b8fd' : '#999' }"
        @click="changePageData(item)"
      >
        {{ item }}
      </p>
    </div>
    <div @click="nextPageData(pageCur)" class="pagebtn">下一页</div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";

interface Item {
  total: number;
  current: number;
}
@Component
export default class DesBtn extends Vue {
  private arr: Array<number> = [];
  @Prop({}) private totalPage!: Item;
  @Prop({}) private pageCur!: number;
  @Prop({}) private pageTo!: number;
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
  @Watch("pageTo", { immediate: true, deep: true }) watchArr(
    newVal: number,
    oldVal: number
  ) {
    console.log(oldVal, newVal, 123456);
    if (oldVal != newVal) {
      console.log("变化了！");
      this.initPageData(newVal);
    }
  }
  changePageData(page: number) {
    let temp = this.pageCur;
    this.clickPage(page);
    console.log(this.arr[this.arr.length - 1] == this.pageTo)
    if(this.pageTo < 5) return
    // console.log("click", this.arr, this.arr[this.arr.length - 1]);
    if (
      (this.arr[this.arr.length - 1] == this.pageTo && temp < page) ||
      (this.arr[0] == 1 && (page == 2 || page == 3))
    ) {
      return;
    }
    if (page < 3) {
      for (let i = 0; i <= 5; i++) {
        i == 5 ? this.arr.splice(i) : this.$set(this.arr, i, i + 1);
      }
      return;
    }
    for (let i = 0; i <= 5; i++) {
      i == 5 ? this.arr.splice(i) : this.$set(this.arr, i, page + i - 2);
    }
    this.arr.indexOf(this.pageTo) == -1
      ? this.arr
      : this.arr.splice(this.arr.indexOf(this.pageTo) + 1);
    console.log(this.arr);
  }
  prePageData(page: number) {
    if(this.pageCur == 1 ) return
    console.log("pre");
    this.prePage();
    if(this.arr[0] == 1) return
    if (this.pageCur >= 3 && this.arr[0] >= page - 2) {
      for (let i = 0; i < 6; i++) {
        i == 5 ? this.arr.splice(i) : this.$set(this.arr, i, page + i - 3);
      }
    }
    console.log(this.arr);
  }
  nextPageData(page: number) {
    if(this.pageCur == this.pageTo ) return
    console.log("next",this.pageCur,this.pageTo);
    this.nextPage();
    page = this.pageCur;
    if (this.pageCur + 2 < this.pageTo && this.arr[0] < page - 2) {
      for (let i = 0; i < 5; i++) {
        if (page + i > this.pageTo) {
          this.arr.splice(i);
          return;
        }
        this.$set(this.arr, i, page + i);
      }
    }
    console.log(this.arr);
  }
  initPageData(page: number) {
    let pageNum = page > 5 ? 5 : page;
    for (let i = 1; i <= pageNum; i++) {
      this.arr[i - 1] = i;
      this.$set(this.arr, i - 1, i);
    }
    this.arr.splice(pageNum);
  }
  created() {
    this.initPageData(this.pageTo);
  }
}
</script>
<style lang="scss">
#des-btn {
  display: flex;
  justify-content: center;
  margin: 50px 0 30px 0;
  font-size: 18px;
  .pagebtn {
    box-sizing: border-box;
    padding: 10px 8px;
    background: #85b8fd;
    color: #fff;
    border-radius: 8px;
    box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
  }
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      margin: 0 18px;
    }
  }
}
</style>