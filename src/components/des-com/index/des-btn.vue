<template>
  <div id="des-btn">
    <div>
      <div @click="prePage" class="btn">上一页</div>
      <div class="numbers">
        <span style="color: #85B8FD;">{{ totalPage.current }}</span
        >/{{ totalPage.total }}
      </div>
      <div @click="nextPage" class="btn">下一页</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

interface Item {
  total: number;
  current: number;
}
@Component
export default class DesBtn extends Vue {
  @Prop({}) private totalPage!: Item;
  private page: number = 0;
  prePage(): void {
    this.$emit("changePage", { type: "prePage" });
  }
  nextPage(): void {
    this.$emit("changePage", { type: "nextPage" });
  }
}
</script>
<style lang="scss">
#des-btn {
  margin: 50px 0 30px 0;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn {
    width: 78px;
    height: 38px;
    border-radius: 8px;
    background: #85b8fd;
    color: #fff;
    font-size: 20px;
    text-align: center;
    line-height: 38px;
    box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
  }
  .numbers {
      font-size: 22px;
      margin: 0 30px;
    }
}
</style>