<template>
  <ul v-if="theme.themeId" class="theme-summary">
    <li class="created-time">{{theme.createdTime.split('T').join(' ')}}</li>
    <li class="department">创建部门：{{theme.department}}</li>
    <li class="content">{{theme.content}}</li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ThemeSummary extends Vue {
  @Prop() theme!: Theme
}
</script>

<style lang="scss" scoped>
.theme-summary {
  border: 4px solid #8ebefe;
  margin-bottom: 20px;
  padding: 20px;
  font-size: 26px;
  line-height: 50px;
  border-radius: 20px;
  .created-time {
    color: #999;
  }
  .department {
    color: #5ca2ff;
  }
}
</style>