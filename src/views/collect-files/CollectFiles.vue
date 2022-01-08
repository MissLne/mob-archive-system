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
    this.$store.dispatch('selectData/setThemeListAsync')
  }
  private theme: any = {};
  passTheme(theme: Theme) {
    this.theme = theme
    if (this.$route.name !== 'collectFilesUpload')
      this.$router.push({ name: 'collectFilesUpload', params: { themeId: theme.themeId.toString() } })
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