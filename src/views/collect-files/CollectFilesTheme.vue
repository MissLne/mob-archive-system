<template>
  <div id="collect-files-theme">
    <DesHead :headData="headData" @handleClick="headClick"/>
    <div class="slots"></div><!-- 占header的位置 -->
    <ul class="theme-container">
      <li
        v-for="theme in themeList"
        :key="theme.themeId"
        @click="passTheme(theme)"
        class="theme-box"
      >{{theme.topic}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { getAllTheme } from '@/services/collect-files'
import { Vue, Component, Emit } from 'vue-property-decorator'
import DesHead from '@/components/des-com/index/des-head.vue';

@Component({
  name: 'CollectFilesTheme',
  components: {
    DesHead
  }
})
export default class CollectFilesTheme extends Vue {
  // 主题列表
  themeList: Array<Theme> = []
  created() {
    const get = async () => {
      const { data } = await getAllTheme()
      this.themeList = data.data
      this.$store.commit('selectData/setThemeList', data.data)
      console.log(data)
    }
    get()
  }

  // 传递当前主题
  @Emit('passTheme')
  passTheme(theme: Theme) {
    return theme
  }

  // 头部处理
  public headData = {
    title: '选择主题',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: false,
    rightUrl: "",
    rightText: "",
    isShow: false,
  }
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
  padding: 20px 25px 20px;
  .theme-container {
    .theme-box {
      background-color: #fff;
      border-bottom: 3px solid #eee;
      padding: 30px 20px;
      margin-bottom: 20px;
      border-radius: 20px;
    }
  }
}
</style>