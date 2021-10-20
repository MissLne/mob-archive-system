<template>
  <DesHead :headData="headData" @handleClick="headClick"/>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import DesHead from '@/components/des-com/index/des-head.vue'

@Component({
  components: {
    DesHead
  }
})
export default class extends Vue{
  private headData: any = {
    title: '回收站',
    leftPic: true,
    leftUrl: "1",
    leftText: "",
    rightPic: true,
    rightUrl: "",
    rightText: "",
    isShow: false,
  }
}
</script>

<style lang="scss">

</style>