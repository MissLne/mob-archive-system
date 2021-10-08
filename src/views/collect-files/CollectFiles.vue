<template>
  <div id="collect-files">
    <keep-alive include="CollectFilesUpload">
      <router-view
        :detailData="detailDataList[0]"
        :collectFilesType="collectFilesType"
        :departmentNameTree="departmentNameTree"
        @passDetailData="passDetailData"
        @nextDetail="nextDetail"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CollectFiles extends Vue {
  private detailDataList: Array<any> = [];
  private collectFilesType: any = null;
  private departmentNameTree: any = null;
  initSelectData() {
    if (!this.collectFilesType)
      this.$service.get('/api/api/type/getCollectedFileType')
        .then(({data: res}: any) => {
          console.log('getCollectedFileType', res)
          if (res.success && res.code === 200)
            this.collectFilesType = res.data.children
        })
    if (!this.departmentNameTree)
      this.$service.get('/api/api/department/getAllDepartmentNameTree')
        .then(({data: res}: any) => {
          console.log('getAllDepartmentNameTree', res)
          if (res.success && res.code === 200)
            this.departmentNameTree = res.data.children
        })
  }
  passDetailData(data: UploadFileData[]) {
    this.initSelectData();
    this.detailDataList = data;
    this.$router.push({ name: 'collectFilesDetail' });
  }
  nextDetail() {
    console.log(this.detailDataList.length)
    if (this.detailDataList.length === 1)
      this.$router.replace({name: 'collectFilesUpload'})
    else
      this.detailDataList.splice(0, 1);
  }
}
</script>

<style lang="scss">
  #collect-files {
    width: 100vw;
    min-height: 100vh;
    background-image: linear-gradient(180deg, #ECF2FE, #E9F1FE);
  }
  .slots {
    height: 124px;
  }
</style>