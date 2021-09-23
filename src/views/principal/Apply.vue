<template>
  <div id="apply">
    <div>头部信息</div>
    <div v-for="(item, index) in itemData" :key="index">
      <ApplyItem :applyItem="item" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ApplyItem from "@/components/apply-com/index/apply-item.vue";

@Component({
  components: {
    ApplyItem,
  },
})
export default class Apply extends Vue {
  private itemData: any[] = [];
  getList(): void {
    (this as any).$request
      .post("/api/api/use/getMyUseApplyList", {})
      .then((res: any) => {
        this.itemData = this.changeStatus(res.data.data.records)
      });
  }
  changeStatus(arr: any[]) {
    let data = new Map([
      [0, "申请"],
      [1, "审批"],
      [2, "同意"],
      [3, "拒绝"],
      [4, "完成"],
    ]);
    let str = arr.map((item: any) => {
      item.status && (item.status = data.get(item.status));
      return item
    })
    return str
  }
  created() {
    this.getList();
  }
}
</script>
<style lang="less">
</style>