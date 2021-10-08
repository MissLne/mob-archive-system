<template>
  <div id="temp-arch">
    <router-view
      :detailData="detailData"
      @passDetailData="passDetailData"
    ></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TempArch extends Vue {
  private detailData: any = null;
  passDetailData(data: ArchItemData) {
    this.$router.push({ name: 'tempArchDetail' })
    this.detailData = data;
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