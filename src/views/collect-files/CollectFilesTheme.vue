<template>
  <div id="collect-files-theme">
    <des-head :headData="headData" @handleClick="headClick">选择主题</des-head>
    <div class="slots"></div><!-- 占header的位置 -->
    <ul class="theme-container">
      <li
        v-for="theme in themeList"
        :key="theme.themeId"
        @click="passTheme(theme)"
        class="theme-box"
      >
        <span>{{theme.topic}}</span>
        <img :src="require('@/assets/index/nextpage.png')">
      </li>
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
  padding: 20px 0;
  .theme-container {
    .theme-box {
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      border-bottom: 3px solid #eee;
      padding: 30px 75px 30px 55px;
      margin-bottom: 2px;
    }
  }
}
</style>