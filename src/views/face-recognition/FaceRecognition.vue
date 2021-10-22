<template>
  <div id="face-recognition">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div>

    <transition-view>
      <keep-alive>
        <router-view
          :faceData="faceData"
          :detailData="detailData"
          @passDetailData="passDetailData"
          class="router-view-box"
        />
      </keep-alive>
    </transition-view>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DesHead from '@/components/des-com/index/des-head.vue'
import TransitionView from '@/components/public-com/TransitionView.vue'

@Component({
  components: {
    DesHead,
    TransitionView
  }
})
export default class FaceDetail extends Vue {
  private faceData: Array<FaceData> = [];
  private detailData: FaceData = {} as FaceData;
  public headData: any = {
    title: '人脸识别',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: false,
    rightUrl: "",
    rightText: "",
    isShow: false,
  }
  created() {
    this.faceData = JSON.parse(localStorage.getItem('faceData') as string);
  }
  public headClick({clickType}: any) {
    if (clickType === 'left') this.$router.go(-1)
  }
  passDetailData(index: number) {
    this.detailData = this.faceData[index];
    console.log(this.detailData)
    this.$router.push({ name: 'faceDetail' })
  }
}
</script>

<style lang="scss">
  #face-recognition {
    
    .router-view-box {
      position: absolute;
      top: 124px;
      width: 100vw;
      height: calc(100vh - 124px);
      overflow: scroll;
      box-sizing: border-box;
    }
  }
</style>