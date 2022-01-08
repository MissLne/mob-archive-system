<template>
  <div id="collect-files-theme">
    <des-head @handleClick="headClick">选择主题</des-head>
    <div class="slots"></div><!-- 占header的位置 -->
    <List
      @chooseTheme="$event => {
        $router.push('QR')
        $emit('passTheme', $event)
      }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DesHead from '@/components/des-com/index/des-head.vue';
import List from '@/components/public-com/Theme/ThemeList.vue'

@Component({
  name: 'ThemeList',
  components: {
    DesHead,
    List
  }
})
export default class ThemeList extends Vue {
  created() {
    this.$store.dispatch('selectData/setThemeListAsync')
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
#theme-list {
  overflow: hidden;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20px 0;
}
</style>