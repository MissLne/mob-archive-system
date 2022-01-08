<template>
  <div id="my-des" @touchmove.self.prevent @mousewheel.self.prevent>
    <des-head @handleClick="handleClick">
      {{$route.params.name}}
      <template #right>{{index ? '' : (isChecking ? isAllSelect ? '取消' : '全选' : '选择')}}</template>
    </des-head>
    <!-- <Alerts
      :title="'确认删除'"
      v-if="alertShow"
      @sureDelete="sureDelete($event)"
    /> -->
    <div class="alertCover" v-if="alertShow"></div>
    <div class="slots"></div>
    <ul class="tabbar">
      <li :class="{ active: index === 0 }">档案</li>
      <li :class="{ active: index === 1 }">详情</li>
    </ul>
    <SlideWrapper :maxLength="2" @setPages="onSetPages">
      <DesList
        ref="des-list"
        @updateChoice="updateChoice($event)"
        @deleteDo="deleteDo"
      ></DesList>
      <DesDetail></DesDetail>
    </SlideWrapper>
    <img
      v-show="isChecking"
      src="@/assets/button/delete.png"
      class="delete"
      @click="deleteItem()"
    />
  </div>
</template>

<script lang="ts">
import SlideWrapper from "@/components/public-com/Slide/SlideWrapper";
import DesHead from "@/components/des-com/index/des-head.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import DesDetail from "./DesDetail.vue";
import DesList from "./DesList.vue";

@Component({
  components: {
    SlideWrapper,
    DesDetail,
    DesList,
    DesHead,
  },
})
export default class MyDes extends Vue {
  private index: number = 0;
  lalal() {
    console.log((this.$refs.ouo as any).style.height);
  }
  private alertShow: boolean = false;
  deleteItem() {
    (this.$refs["des-list"] as DesList).alertShow = true;
    this.alertShow = true;
  }
  deleteDo() {
    this.alertShow = (this.$refs["des-list"] as DesList).alertShow;
  }
  handleClick({ clickType }: any) {
    // 在详情页点右边，忽略
    if (this.index === 1 && clickType === 'right') return;
    // 在列表页点右边
    (this.$refs["des-list"] as DesList).handleClick({ clickType, index: this.index });
  }
  private isChecking: boolean = false
  private isAllSelect: boolean = false
  updateChoice({ isChecking, isAllSelect }: {[key: string]: boolean}) {
    this.isChecking = isChecking
    this.isAllSelect = isChecking && isAllSelect
  }
  onSetPages(indexList: Array<number>) {
    this.index = indexList[1];
  }
}
</script>

<style lang="scss" scoped>
#my-des {
  overflow: auto;
  height: 100vh;
  overflow: hidden;
  .delete {
    width: 82px;
    height: 82px;
    position: fixed;
    right: 30px;
    bottom: 100px;
    z-index: 99;
  }
  .tabbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 180px;
    height: 50px;
    padding: 24px 30px 0;
    // background: burlywood;
    li {
      position: relative;
      z-index: 1; // 不然会被下面盖住。。
      width: 72px;
      color: #999;
      font-size: 30px;
      text-align: center;
      line-height: 36px;
      &.active {
        color: #4187e4;
        font-size: 36px;
      }
      &.active::after {
        content: "";
        position: absolute;
        bottom: 5px;
        left: 30%;
        height: 5px;
        width: 40%;
        background-color: #4187e4;
        border-radius: 3px;
        transform: translateY(12px);
      }
    }
  }
  .alertCover {
    font-size: 34px;
    z-index: 1000;
    width: 100vw;
    height: 74px;
    position: fixed;
    top: 124px;
    // top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .upload {
    width: 82px;
    height: 82px;
    position: fixed;
    right: 30px;
    bottom: 100px;
    z-index: 99;
  }
}
</style>