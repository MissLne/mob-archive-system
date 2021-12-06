<template>
  <div id="temp-arch">
    <transition-view>
      <router-view
        :detailDataList="detailDataList"
        :fondsIdentifier="fondsIdentifier"
        :dossierType="dossierType"
        :departmentNameTree="departmentNameTree"
        @passDetailData="passDetailData"
      ></router-view>
    </transition-view>
<!--     <button @click="add">add</button>
    <button @click="del">del</button> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TransitionView from '@/components/public-com/TransitionView.vue'

@Component({
  name: 'TempArch',
  components: {
    TransitionView
  }
})
export default class TempArch extends Vue {
  private detailDataList: Array<any> = [];
  private fondsIdentifier: any = null; // 全宗号
  private dossierType: any = null; // 类别号
  private departmentNameTree: any = null; // 部门
/* add() {
  this.detailDataList.splice(this.detailDataList.length, 0, {a: 123});
  console.log(this.detailDataList);
}
del() {
  this.detailDataList.splice(0, 1);
  console.log(this.detailDataList);
} */
  created() {
  }
  initSelectData() {
    this.fondsIdentifier = JSON.parse(localStorage.getItem('fondsIdentifier') as string)
    this.dossierType = JSON.parse(localStorage.getItem('dossierType') as string)
    this.departmentNameTree = JSON.parse(localStorage.getItem('departmentNameTree') as string)
  }
  passDetailData(data: ArchItemData[]) {
    this.initSelectData();
    this.detailDataList = data;
    this.$router.push({
      name: 'tempArchDetail',
    })
  }
}
</script>

<style lang="scss">
  /* #temp-arch {
    width: 100vw;
    min-height: 100vh;
  } */
</style>