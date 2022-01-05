<template>
  <div id="collect-files-theme">
    <button @click="get">hello</button>
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

@Component({
  name: 'CollectFilesTheme'
})
export default class CollectFilesTheme extends Vue {
  themeList: Array<any> = []
  async get() {
    const { data } = await getAllTheme()
    this.themeList = data.data
    this.$store.commit('selectData/setThemeList', data.data)
    console.log(data)
  }
  @Emit('passTheme')
  passTheme(theme: any) {
    return theme
  }
}
</script>

<style lang="scss">
#collect-files-theme {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20px 25px 0;
  .theme-container {
    .theme-box {
      height: 60px;
      background-color: #fff;
      border-bottom: 3px solid #eee;
    }
  }
}
</style>