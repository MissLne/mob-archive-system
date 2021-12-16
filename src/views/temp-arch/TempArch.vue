<template>
  <div id="temp-arch">
      <router-view
        :detailDataList="detailDataList"
        @passDetailData="passDetailData"
      ></router-view>
<!--     <button @click="add">add</button>
    <button @click="del">del</button> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'TempArch',
  components: {}
})
export default class TempArch extends Vue {
  private detailDataList: Array<any> = [];
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
  passDetailData(data: ArchItemData[]) {
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