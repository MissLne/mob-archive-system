<template>
  <div id="collect-files-theme">
    <des-head @handleClick="headClick">选择主题</des-head>
    <div class="slots"></div><!-- 占header的位置 -->
    <ThemeList
      @chooseTheme="passTheme"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator'
import DesHead from '@/components/des-com/index/des-head.vue';
import ThemeList from '@/components/public-com/Theme/ThemeList.vue'

@Component({
  name: 'CollectFilesTheme',
  components: {
    DesHead,
    ThemeList
  }
})
export default class CollectFilesTheme extends Vue {
  // 传递当前主题
  @Emit('passTheme')
  passTheme(theme: Theme) {
    return theme
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
#collect-files-theme {
  overflow: hidden;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20px 0;
}
</style>