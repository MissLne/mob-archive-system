<template>
  <transition name="van-fade">
    <img
      v-if="!isLoading"
      :src="recognized ? 
        require('@/assets/face-recognition/manual-input.png') :
        require('@/assets/face-recognition/face.png')"
      class="icon"
      @click="getFaceData"
    >
    <van-loading
      v-else
      color="#85b8fd"
      size="35px"
    />

  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { Loading } from 'vant'

@Component
export default class FaceRecognitionIcon extends Vue {
  @Prop() fileId!: number;
  private recognized: boolean = false;
  private isLoading: boolean = false;
  private faceData: Array<any> = [];
  getFaceData() {
    // 尚未获得数据
    if (this.faceData.length === 0) {
      this.isLoading = true;
      this.$service.get(`/api/api/face/faceRecognition?fileId=${this.fileId}`)
        .then(({data: res}: any) => {
          console.log(res.data);
          if (res.code === 200) {
            this.faceData = res.data;
            this.passFaceDataName();
          }
          else throw Error()
        })
        .catch((err: any) => {
          console.log(err)
        })
        .finally(() => {
          this.recognized = true;
          this.isLoading = false;
        })
    }
    // 已经获取数据，进入人脸详情
    else {
      console.log('有了')
    }
  }
  @Emit('passFaceDataName')
  passFaceDataName(): string {
    return this.faceData
      .map(value => value.name)
      .filter(value => value)
      .join(',')
  }
}
</script>

<style lang="scss" scoped>
  .icon {
    width: 35px;
    height: 35px;
  }
</style>