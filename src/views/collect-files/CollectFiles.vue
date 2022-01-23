<template>
  <div id="collect-files">
    <keep-alive :include="['CollectFilesUpload', 'CollectFilesTheme']">
      <router-view
        :theme="theme"
        @passTheme="passTheme"
        :detailDataList="detailDataList"
        @passDetailData="passDetailData"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getCollectedFileType, getAllDepartmentTree } from '@/services/collect-files'

@Component({
  name: 'CollectFiles',
})
export default class CollectFiles extends Vue {
  async initSelectData() {
    try {
      if (!localStorage.getItem('collectFilesType')) {
        const { data } = await getCollectedFileType();
        if (data.success && data.code === 200)
          localStorage.setItem('collectFilesType', JSON.stringify(data.data.children))
      }
      if (!localStorage.getItem('getCollectedFileType')) {
        const { data } = await getAllDepartmentTree();
        if (data.success && data.code === 200)
          localStorage.setItem('allDepartmentNameTree', JSON.stringify(data.data.children))
      }
    } catch (error) {
      console.log('error when fetch select-data', error);
    }
  }
  created() {
    this.initSelectData();
    this.$store.dispatch('selectData/setThemeListAsync', { needNull: true })
  }

  private v_theme: Partial<Theme> = { themeId: 0, topic: '暂不选择主题' };
  get theme() {
    const list: Theme[] = this.$store.state.selectData.themeList
    const themeId = parseInt((this.$route.query as any).themeId)
    if (list.length && themeId) {
      // 把查询参数删掉
      this.$router.replace(this.$route.path)
      this.v_theme = list[themeId]
    }
    return this.v_theme;
  }
  set theme(newValue: Partial<Theme>) {
    this.v_theme = newValue;
  }

  passTheme(theme: Theme) {
    this.theme = theme
    // 如果是主题列表页
    if (this.$route.name === 'collectFilesTheme')
      this.$router.go(-1)
    // 如果是其它页面
    else
      this.$router.push({ name: 'collectFilesUpload' })
  }
  private detailDataList: Array<any> = [];
  passDetailData(data: UploadFileData[]) {
    this.detailDataList = data
    this.$router.push({ name: 'collectFilesDetail' })
  }
}
</script>

<style lang="scss">
  /* #collect-files {
    width: 100vw;
    min-height: 100vh;
  } */
</style>