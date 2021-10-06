<template>
  <div id="apply">
    <DesHead :headData="headData" />
    <DesSearch :searchText="searchText"/>
    <div class="slots"></div>
    <div v-for="(item, index) in itemData" :key="index">
      <ApplyItem :applyItem="item" />
    </div>
    <div class="slots2"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ApplyItem from "@/components/apply-com/index/apply-item.vue";
import DesHead from "@/components/des-com/index/des-head.vue";
import DesSearch from "@/components/des-com/index/des-search.vue";

@Component({
  components: {
    ApplyItem,
    DesHead,
    DesSearch
  },
})
export default class Apply extends Vue {
  private searchText: string = "请输入时间搜索"
  private itemData: any[] = [];
  public headData: any = {
    title: "借阅申请",
    leftUrl: "3",
    rightUrl: "",
    leftPic: true,
    rightPic: false,
    leftText: "",
    rightText: "选择",
    isShow: false,
  };
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
<style lang="scss">
#apply {
  .slots {
    height: 222px;
  }
  .slots2 {
    height: 90px;
  }
  min-height: 100vh;
  width: 750px;
  background: #EBF2FE;
}
</style>