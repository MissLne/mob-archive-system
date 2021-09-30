<template>
  <div id="editApply">
    <DesHead :headData="headData" />
    <div class="slots"></div>
    <Details v-if="detailData" :detailData="detailData" @btnClick="btnClick($event)"/>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Details from "@/components/apply-com/edit/details.vue";
import DesHead from "@/components/des-com/index/des-head.vue";

@Component({
  components: {
    Details,
    DesHead
  },
})
export default class editApply extends Vue {
  public detailData: any = "";
  public headData: any = {
    title: "详情",
    leftUrl: "1",
    rightUrl: "",
    leftPic: true,
    rightPic: false,
    leftText: "",
    rightText: "",
    isShow: false,
  };
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
        console.log(this.detailData);
        
        this.detailData.status = data.get(this.detailData.status);
      });
      this.$request.get("/api/api/use/getMyUseResultByUseApplyId",this.$route.params)
      .then((res: any) => {
        console.log(res);
      })
  }
  btnClick(event: any) {
    console.log(event)
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
<style lang="scss">
#editApply {
  .slots {
    height: 124px;
  }
  width: 100vw;
  min-height: 100vh;
  background: #E5EDFD;
}
</style>