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
      class="loading"
    />

  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { Loading } from 'vant'
import Msg from '@/components/public-com/MsgBox/Msg';
import { faceRecognition } from '@/services/face-recognition';

@Component({
  components: {
    'van-loading': Loading,
  }
})
export default class FaceRecognitionIcon extends Vue {
  @Prop() fileId!: number;
  private recognized: boolean = false;
  private isLoading: boolean = false;
  private faceData: Array<FaceData> = [];
  async getFaceData() {      
    // 尚未获得数据
    if (!this.recognized) {
      this.isLoading = true;
      try {
        const { data: { data, code } } = await faceRecognition({ fileId: this.fileId })
        if (code === 200) {
          this.faceData = data;
          this.$store.commit('setFaceData', data);
          this.recognized = true;
          this.passFaceDataName();
          Msg.success('人脸识别完毕')
        }
        else throw Error()
      } catch (error) {
        console.log(error)
        Msg.error('人脸识别失败')
      } finally {
        this.isLoading = false;
      }
    }
    // 已经获取数据，进入人脸详情
    else {
      this.$router.push({name: 'faceList'})
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
  .icon,
  .loading {
    width: 35px;
    height: 35px;
  }
</style>