<template>
  <div id="apply">
   <div>头部信息</div>
   <div v-for="(item,index) in itemData" :key="index">
     <ApplyItem :applyItem="item"/>
   </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ApplyItem from '@/components/apply-com/index/apply-item.vue'

@Component ({
  components: {
    ApplyItem
  }
})
export default class Apply extends Vue {
  private itemData: [] = []
  getList(): void {
    (this as any).$request
      .post("/api/api/use/getMyUseApplyList",{})
      .then((res: any) => {
        console.log(res.data.data.records);
        this.itemData = res.data.data.records
      });
  }
  created() {
    this.getList()
  }
}
</script>
<style lang="less">
</style>