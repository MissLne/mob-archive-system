<template>
  <div id="collect-files-scan">
    <!-- 测试按钮 -->
    <!-- <div>
      <button @click="() => start = true">test</button>
      <button @click="() => start = false">stop</button>
      <button @click="shot">shot</button>
      {{width}}
      {{height}}
      <span style="word-break: break-all;">res:{{res}}</span>
    </div> -->
    <!-- 返回按钮 -->
    <img
      :src="require('@/assets/head/back@2x.png')"
      class="back"
      @click="() => $router.go(-1)"
    >
    <!-- 提示 -->
    <div class="tips">--请扫描PC端二维码--</div>
    <!-- 摄像头显示内容 -->
    <video
      ref="video"
      autoplay
      class="video"
    ></video>
    <!-- 动画杠杠 -->
    <div v-show="start" class="scanner"></div>
    <!-- 用于截屏 -->
    <canvas
      ref="canvas"
      :width="width" 
      :height="height"
      style="display: none"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import jsQR from 'jsqr'
import { Dialog } from 'vant'

@Component({
  name: 'CollectFilesScan',
})
export default class CollectFilesScan extends Vue {
  width: number = 0
  height: number = 0
  
  get video() {
    return this.$refs['video'] as HTMLVideoElement
  }
  // 返回canvas的二维渲染上下文
  get ctx() {
    return (this.$refs['canvas'] as HTMLCanvasElement).getContext('2d')
  }
  // 定期扫描的定时器
  timer: number = -1
  // 是否开始视频
  private v_start: boolean = false
  get start() { return this.v_start }
  set start(newValue) {
    if (newValue === true) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment'} })
        .then(stream => {
          this.video.srcObject = stream
          this.v_start = newValue
          // 开始扫描
          this.timer = setInterval(this.shot, 1000)
        })
        .catch(err => console.log('error when getUserMedia', err))
    }
    else {
      (this.video.srcObject as MediaStream)
        .getTracks()
        .forEach(t => t.stop())
      this.v_start = newValue
      // 停止扫描
      clearTimeout(this.timer)
    }
  }

  created() { this.start = true }
  beforeDestroy() { this.start = false }
  deactivated() { this.start = false }

  res: any = null
  shot() {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      // 获取视频的真实宽高，用于设置canvas的大小，让canvas与视频一样大
      if (!this.width || !this.height) {
        this.width = this.video.videoWidth
        this.height = this.video.videoHeight
      }
      // 截取视频
      this.ctx?.drawImage(this.video, 0, 0)
      // 截取canvas画面
      const imageData = this.ctx?.getImageData(0, 0, this.width, this.height)
      // 识别画面中的二维码
      if (imageData) this.res = jsQR(imageData?.data, imageData?.width, imageData?.height)?.data
      // 如果扫描成功了
      if (this.res) {
        // 停止摄像头和扫描
        this.start = false
        // 如果是符合要求的二维码 
        if ((this.res as string).startsWith('collectFiles/themeId/')) {
          const themeId = this.res.split('/')[2]
          // 如果themeId在合理范围内
          if (1 <= themeId && themeId <= this.$attrs.themeList.length)
            this.$emit('passTheme', this.$attrs.themeList[themeId - 1])
          else
            Dialog({ message: '该themeId不存在' })
              .finally(() => this.start = true)
        }
        else
          Dialog({ message: '请扫描站内二维码' })
            .finally(() => this.start = true)
      }
    }
  }
}
</script>

<style lang="scss">
#collect-files-scan {
  background-color: #4E5963;
  .back {
    position: absolute;
    left: 33px;
    top: 73px;
    width: 40px;
  }
  .tips {
    z-index: 1;
    position: absolute;
    bottom: 236px;
    left: 0;
    right: 0;
    margin: auto;
    color: #fff;
    text-align: center;
  }
  .video {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    padding: 196px 70px;
    object-fit: cover;
  }
  .scanner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: calc(100vw - 75px * 2);
    height: 6px;
    background-color: rgba(50, 124, 215, 0.5);
    margin: auto;
    border-radius: 40%;
    animation: scan 2s linear infinite;
    &::before {
      overflow: hidden;
      content: '';
      display: block;
      width: 100%;
      height: 60px;
      background-image:
        linear-gradient(360deg, rgba(50, 124, 215, 0.5), transparent);
      transform: translateY(-100%);
    }
  }
  @keyframes scan {
    0% {
      opacity: 0;
      transform: translateY(calc(196px));
    }
    20%, 80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(calc(100vh - 196px));
    }
  }
}
</style>