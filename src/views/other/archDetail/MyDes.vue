<template>
  <div id="my-des" @touchmove.self.prevent @mousewheel.self.prevent>
    <DesHead
      :headData="headData"
      @handleClick="handleClick"
    />
    <div class="slots"></div>
    <ul class="tabbar">
      <li :class="{ active: index === 0 }">档案</li>
      <li :class="{ active: index === 1 }">详情</li>
    </ul>
    <SlideWrapper :maxLength="2" @setPages="onSetPages">
      <DesList ref="des-list"></DesList>
      <DesDetail></DesDetail>
    </SlideWrapper>
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
  }
})
export default class MyDes extends Vue {
  public headData: any = {
    title: "",
    leftUrl: "1",
    rightUrl: "2",
    leftPic: true,
    rightPic: false,
    leftText: "",
    rightText: "选择",
    isShow: false,
  };
  private index: number = 0;
  created() {
    this.headData.title = this.$route.params.name;
  }
  lalal() {
    console.log((this.$refs.ouo as any).style.height)
  }
  handleClick(e: any) {
    // 在详情页且点右边
    if (this.index === 1 && e.clickType === 'right') return;
    (this.$refs['des-list'] as DesList).handleClick(e);
  }

  onSetPages(indexList: Array<number>) {
    this.index = indexList[1];
    if (indexList[1] === 0)
      this.headData.rightText = '选择';
    else
      this.headData.rightText = '';
  }
}
</script>

<style lang="scss" scoped>
  #my-des {
    overflow: auto;
    height: 100vh;
    overflow: hidden;
    
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
          color: #4187E4;
          font-size: 36px;
        }
        &.active::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 30%;
          height: 5px;
          width: 40%;
          background-color: #4187E4;
          border-radius: 3px;
          transform: translateY(12px);
        }
      }
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