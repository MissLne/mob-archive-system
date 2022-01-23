<template>
  <div class="theme-qr">
    <des-head @handleClick="headClick">{{theme.topic}}</des-head>
    <div class="slots"></div>
    <ThemeSummary :theme="theme"/>
    <div class="img-box">
      <div v-if="src === ''">
        该主题暂时无二维码
        <button @click="createQR">创建</button>
      </div>
      <img
        v-else
        :src="src"
        @click="preview"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import DesHead from '@/components/des-com/index/des-head.vue';
import ThemeSummary from '@/components/public-com/Theme/ThemeSummary.vue'
import { createQRCoder, getQRCoder } from '@/services/theme';
import { toObjectURL } from '@/utils/picture';
import { ImagePreview } from 'vant';
import { QRURL } from '@/utils/QRURL'

@Component({
  components: {
    DesHead,
    ThemeSummary,
  }
})
export default class ThemeQR extends Vue {
  @Prop() theme!: Theme
  src: string = ''
  created() {
    this.getQR()
  }

  async getQR() {
    // 这个data是一个blob对象
    const { data } = await getQRCoder({ themeId: this.theme.themeId })
    // json是无二维码的信息，否则是二维码图片的blob对象
    if (data.type !== 'application/json')
      this.src = toObjectURL(data)
  }

  async createQR() {
    const { data } = await createQRCoder({ url: QRURL + this.theme.themeId, themeId: this.theme.themeId })
    this.getQR()
  }

  preview() {
    ImagePreview([this.src])
  }

  // 头部处理
  public headClick({clickType}: any) {
    // 正在上传不给点头部
    if (clickType === 'left') {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss">
  .theme-qr {
    padding: 20px 20px;
    .img-box {
      display: flex;
      justify-content: center;
    }
  }
</style>