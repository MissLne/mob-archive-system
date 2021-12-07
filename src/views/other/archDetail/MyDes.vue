<template>
  <div id="my-des">
    <DesHead
      :headData="headData"
      @handleClick="handleClick"
    />
    <div class="slots"></div>
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

  created() {
    this.headData.title = this.$route.params.name;
  }

  handleClick(e: any) {
    // 在详情页且点右边
    if (this.headData.rightText === '' && e.clickType === 'right') return;
    (this.$refs['des-list'] as DesList).handleClick(e);
  }

  onSetPages(indexList: Array<number>) {
    if (indexList[1] === 0)
      this.headData.rightText = '选择';
    else
      this.headData.rightText = '';
  }
}
</script>

<style lang="scss">
  #my-des {
    overflow: auto;
    height: 100vh;
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