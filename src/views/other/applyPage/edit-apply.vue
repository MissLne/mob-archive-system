<template>
  <div id="editApply">
    <Details v-if="detailData" :detailData="detailData" @btnClick="btnClick($event)"/>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Details from "@/components/apply-com/edit/details.vue";

@Component({
  components: {
    Details,
  },
})
export default class editApply extends Vue {
  public detailData: any = "";
  created() {
    this.getDetail();
  }
  getDetail() {
    (this as any).$request
      .get("/api/api/use/getUseApplyDetail", this.$route.params)
      .then((res: any) => {
        this.detailData = Object.assign(res.data.data,this.$route.params);
        
        let data = new Map([
          [0, "申请"],
          [1, "审批"],
          [2, "同意"],
          [3, "拒绝"],
          [4, "完成"],
        ]);
        this.detailData.status = data.get(this.detailData.status);
      });
  }
  btnClick(event: any) {
    console.log(event);
    let todo = new Map([
      ["撤回",() => {
        (this as any).$request.post("/api/api/use/recallUseApply",
          // id: [`${this.$route.params.id}`]
          [`${this.$route.params.id}`]
        )
        .then((res: any) => {
          console.log(res);
        })
      }],
      ["删除",() => {
        (this as any).$request.post("/api/api/use/deleteUseApply",
          [`${this.$route.params.id}`]
        )
        .then((res: any) => {
          console.log(res);
        })
      }]
    ])
    let action: any = todo.get(event.type)
    action.call(this)
  }
}
</script>
<style lang="less">
</style>