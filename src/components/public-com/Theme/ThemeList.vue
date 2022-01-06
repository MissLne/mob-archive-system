<template>
  <ul class="theme-list">
    <li
      v-for="theme in themeList"
      :key="theme.themeId"
      @click="chooseTheme(theme)"
      class="theme-box"
    >
      <span>{{theme.topic}}</span>
      <img :src="require('@/assets/index/nextpage.png')">
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component({
  name: 'ThemeList',
})
export default class ThemeList extends Vue {
  // 主题列表
  get themeList() {
    return this.$store.state.selectData.themeList
  }

  // 传递当前主题
  @Emit('chooseTheme')
  chooseTheme(theme: Theme) {
    return theme
  }
}
</script>

<style lang="scss">
.theme-list {
  .theme-box {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-bottom: 3px solid #eee;
    padding: 30px 75px 30px 55px;
    margin-bottom: 2px;
  }
}
</style>