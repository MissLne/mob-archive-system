<template>
  <div class="theme-summary">
    <ul
      v-if="theme.themeId"
      class="main"
    >
      <li class="topic">{{theme.topic}}</li>
      <li class="created-time">{{theme.createdTime.split('T').join(' ')}}</li>
      <li class="department">创建部门：{{theme.department}}</li>
      <li class="content">{{theme.content}}</li>
    </ul>
    <div
      v-if="showBtn"
      class="btn"
      @click="$router.push({ name: 'collectFilesTheme' })"
    >选择主题</div>
  </div>
  <!-- <ul v-else>
    <button @click="$router.push('')">选择主题</button>
  </ul> -->
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ThemeSummary extends Vue {
  @Prop() theme!: Theme
  @Prop({ default: false }) showBtn!: boolean
}
</script>

<style lang="scss" scoped>
.theme-summary {
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
  border: 4px solid #8ebefe;
  margin-bottom: 20px;
  background-color: #8ebefe;
  line-height: 40px;
  border-radius: 20px;
  .main {
    padding: 20px;
    background-color: #ebf2fe;
    font-size: 24px;
    border-radius: 20px;
    .topic {
      margin-bottom: 10px;
      font-size: 34px;
      font-weight: bold;
    }
    .created-time {
      color: #999;
    }
    .department {
      color: #5ca2ff;
    }
  }
  .btn {
    // background-color: #8ebefe;
    color: #fff;
    font-size: 26px;
    line-height: 56px;
    text-align: center;
  }
}
</style>