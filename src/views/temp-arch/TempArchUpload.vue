<template>
  <div id="temp-arch-upload">
    <button @click="getTempArchList">加载</button>
    <ArchList
      :listData="listData"
      @passClickIndex="passDetailData"
    />
    <UploadBtn/>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'
import UploadBtn from '@/components/public-com/UploadBtn.vue';
import ArchList from '../../components/public-com/ArchList.vue';

interface SomeData {
  fondsIdentifier: any;
  dossierType: any;
  departmentTree: any;
}

@Component({
  components: {
    UploadBtn,
    ArchList
  }
})
export default class TempArchUpload extends Vue {
  private listData: Array<ArchItemData> = []
  private someData: SomeData | null = null;
  getTempArchList() {
    (this as any).$service.get('/api/api/archive/selectTemporaryArchive')
    .then((res: any) => {
      console.log(res)
      res = res.data.data;
      this.listData = res;
    })
    .catch((err: any) => {
      console.log(err)
    })
  }
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
    /* this.currentData = {
      detailData: e,
      ...this.someData
    }; */
  }
  @Emit('passDetailData')
  passDetailData(index: number) {
    // this.$emit('passDetailData', this.listData[index]);
    return this.listData[index];
  }
}
</script>

<style lang="scss">
  #temp-arch-upload {
    box-sizing: border-box;
    padding: 20px 25px 0;
  }
</style>