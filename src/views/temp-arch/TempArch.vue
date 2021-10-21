<template>
  <div id="temp-arch">
    <transition :name="transitionName">
      <keep-alive include="TempArchUpload">
        <router-view
          :detailData="detailDataList[0]"
          :fondsIdentifier="fondsIdentifier"
          :dossierType="dossierType"
          :departmentNameTree="departmentNameTree"
          @passDetailData="passDetailData"
          @nextDetail="nextDetail"
        ></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { watchRouteChange } from '@/utils/utils-component'

@Component
export default class TempArch extends Vue {
  private detailDataList: Array<any> = [];
  private fondsIdentifier: any = null; // 全宗号
  private dossierType: any = null; // 类别号
  private departmentNameTree: any = null; // 部门
  private transitionName: string = ''; // 用于动画

  created() {
    watchRouteChange(this)
  }
  initSelectData() {
    this.fondsIdentifier = JSON.parse(localStorage.getItem('fondsIdentifier') as string)
    this.dossierType = JSON.parse(localStorage.getItem('dossierType') as string)
    this.departmentNameTree = JSON.parse(localStorage.getItem('departmentNameTree') as string)
    /* if (!this.fondsIdentifier) {
      this.$service.get(`/api/api/fondsIdentifier/getFondsIdentifier`)
        .then(({data: res}: any) => {
          console.log('getCollectedFileType', res)
          if (res.success && res.code === 200)
            this.fondsIdentifier = res.data
        })
    }
    if (!this.dossierType) {
      this.$service.get(`/api/api/type/getDossierType`)
        .then(({data: res}: any) => {
          console.log('getCollectedFileType', res)
          if (res.success && res.code === 200)
            this.dossierType = res.data.children
        })
    }
    if (!this.departmentNameTree) {
      this.$service.get(`/api/api/department/getDepartmentTree`)
        .then(({data: res}: any) => {
          console.log('getCollectedFileType', res)
          if (res.success && res.code === 200)
            this.departmentNameTree = res.data.children
        })
    } */
  }
  passDetailData(data: ArchItemData[]) {
    this.initSelectData();
    this.detailDataList = data;
    this.$router.push({ name: 'tempArchDetail' })
  }
  nextDetail() {
    console.log('oaisfhjosjdosi', this.detailDataList.length)
    if (this.detailDataList.length === 1)
      this.$router.go(-1);
    else
      this.detailDataList.splice(0, 1);
  }
}
</script>

<style lang="scss">
  #temp-arch {
    width: 100vw;
    min-height: 100vh;
    background-image: linear-gradient(180deg, #ECF2FE, #E9F1FE);
  }
</style>