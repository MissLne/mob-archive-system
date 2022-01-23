<template>
  <div>
    <keep-alive include="ThemeList">
      <router-view
        @passTheme="passTheme"
        :theme="theme"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'Theme',
})
export default class Theme extends Vue {
  private theme: any = {}
  passTheme(theme: Theme) {
    this.theme = theme
  }
}
</script>

<style lang="scss">
</style>