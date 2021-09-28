<template>
  <div id="temp-arch">
    <router-view @navToDetail="getDetailData" :detailData="currentData"></router-view>
    <UploadBtn/>
  </div>
</template>

<script lang="ts">
import UploadBtn from '@/components/public-com/UploadBtn.vue';
import { Component, Vue } from 'vue-property-decorator'

interface SomeData {
  fondsIdentifier: any;
  dossierType: any;
  departmentTree: any;
}

@Component({
  components: {
    UploadBtn
  }
})
export default class TempArch extends Vue {
  private currentData: Object | null = null;
  private someData: SomeData| null = null;
  getDetailData(e: ArchItemData) {
    console.log('get!', e)
    if (!this.someData) {
      Promise.all([
        // 全宗号
        this.$service.get(`/api/api/fondsIdentifier/getFondsIdentifier?id=${e.departmentId}`),
        // 类别号
        this.$service.get(`/api/api/type/getDossierType?id=${e.departmentId}`),
        // 部门
        this.$service.get(`/api/api/department/getDepartmentTree?id=${e.departmentId}`),
      ])
      .then(values => {
        console.log(values)
      })

    }
    this.currentData = {
      detailData: e,
      ...this.someData
    };
  }
}
</script>

<style lang="scss">
  #temp-arch {
    width: 100vw;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px 25px 0;
    background-color: #EAF1FE;
    
  }
</style>