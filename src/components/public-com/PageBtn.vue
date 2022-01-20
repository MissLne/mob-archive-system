<template>
  <div
    v-if="pageTotal"
    id="page-btn"
  >
    <div
      class="btn"
      @click="changePage(pageCur - 1)"
    >上一页</div>
    <ul class="list">
      <li
        v-for="item in arr"
        :key="item"
        :style="{ color: pageCur == item ? '#85b8fd' : '#999' }"
        class="item"
        @click="changePage(item)"
      >
        {{ item }}
      </li>
    </ul>
    <div
      class="btn"
      @click="changePage(pageCur + 1)"
    >下一页</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";

@Component
export default class PageBtn extends Vue {
  // 索引数组
  private arr: number[] = [];
  // 总页数
  @Prop() pageTotal!: number;
  // 当前页数
  @Prop() pageCur!: number;

  @Watch('pageTotal', { immediate: true })
  pageTotalChange() {
    this.changePage(this.pageCur)
  }

  @Emit('changePage')
  changePage(page: number) {
    // 如果跳转的页数不对劲，直接run了
    if (page < 1 || page > this.pageTotal)
      return null;

    // 起始索引
    let startIndex = page - 2 < 1 ? 1 : page - 2;
    // 末尾索引
    let endIndex = page + 2 > this.pageTotal ? this.pageTotal : page + 2;

    // 如果不够五个（end - start + 1 < 5）
    while (endIndex - startIndex < 4) {
      // 如果开头还能再塞（说明*当前页数*在末尾）
      if (startIndex > 1) --startIndex;
      // 如果末尾还能再塞（说明*当前页数*在开头）
      else if (endIndex < this.pageTotal) ++endIndex;
      // 说明就这么多页了，即pageTotal < 5
      else break;
    }

    // 把新索引塞进去
    const newArr = [];
    for (let i = startIndex; i <= endIndex; ++i)
      newArr.push(i)
    this.arr = newArr;
    return page;
  }
}
</script>
<style lang="scss" scoped>
#page-btn {
  display: flex;
  justify-content: center;
  margin: 50px 0 30px 0;
  font-size: 18px;
  .btn {
    box-sizing: border-box;
    padding: 10px 8px;
    background: #85b8fd;
    color: #fff;
    border-radius: 8px;
    box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
  }
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item {
      margin: 0 18px;
    }
  }
}
</style>