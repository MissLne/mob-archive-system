<template>
  <div class="theme-qr">
    <des-head @handleClick="headClick">详情</des-head>
    <div class="slots"></div>
    <ThemeSummary :theme="theme"/>
    <div class="img-box">
      <div
      v-if="src === ''"
      >
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
    const { data } = await getQRCoder({ themeId: this.theme.themeId })
    if (data.type === 'application/json')
      console.log('123')
    else
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
    padding: 0 20px;
    .img-box {
      display: flex;
      justify-content: center;
    }
  }
</style>