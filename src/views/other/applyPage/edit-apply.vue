<template>
  <div id="editApply">
    <Alerts
      :title="alertTitle"
      v-if="alertShow"
      @sureDelete="sureDelete($event)"
    />
    <DesHead :headData="headData" @handleClick="handleClick($event)" />
    <div class="slots"></div>
    <Details
      v-if="detailData"
      :detailData="detailData"
      @btnClick="btnClick($event)"
    />
    <FileData :fileData="fileData" v-if="fileData.length" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Details from "@/components/apply-com/edit/details.vue";
import DesHead from "@/components/des-com/index/des-head.vue";
import FileData from "@/components/apply-com/edit/fileData.vue";
import Alerts from "@/components/tools/alerts.vue";
import MsgBox from "@/components/public-com/MsgBox/Msg";

@Component({
  components: {
    Details,
    DesHead,
    FileData,
    Alerts,
  },
})
export default class editApply extends Vue {
  public detailData: any = "";
  private alertTitle: string = "";
  private alertShow: boolean = false;
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
  public fileData: any[] = [];
  created() {
    this.getDetail();
  }
  getDetail() {
    (this as any).$request
      .get("/api/api/use/getUseApplyDetail", this.$route.params)
      .then((res: any) => {
        console.log(this.$route.params, res.data.data);

        this.detailData = Object.assign(res.data.data, this.$route.params);

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
    this.$request
      .get("/api/api/use/getMyUseResultByUseApplyId", this.$route.params)
      .then((res: any) => {
        let result = res.data.data;
        result.map((item: any, index: number) => {
          if (item.hasOwnProperty("fileToken") && item.fileToken !== null) {
            this.$service
              .get(`/api/api/file/download/${item.fileToken}`, {
                responseType: "arraybuffer",
              })
              .then((data: any) => {
                item.fileToken =
                  "data:image/png;base64," +
                  btoa(
                    new Uint8Array(data.data).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      ""
                    )
                  );
              });
          }
        });
        this.fileData = result;
      });
  }
  sureDelete(event: any) {
    if (event.type === "not") {
      this.alertShow = false;
    } else {
      this.alertShow = false;
      let todo = new Map([
        [
          "撤回",
          () => {
            (this as any).$request
              .post(
                "/api/api/use/recallUseApply",
                // id: [`${this.$route.params.id}`]
                [`${this.$route.params.id}`]
              )
              .then((res: any) => {
                if (res.data.success === true) {
                  this.$router.go(-1);
                  MsgBox.success("撤回成功");
                  return;
                }
                throw new Error();
              })
              .catch((err: any) => {
                MsgBox.error("撤回失败");
              });
          },
        ],
        [
          "删除",
          () => {
            (this as any).$request
              .post("/api/api/use/deleteUseApply", [`${this.$route.params.id}`])
              .then((res: any) => {
                if (res.data.success === true) {
                  this.$router.go(-1);
                  MsgBox.success("删除成功");
                  return;
                }
                throw new Error();
              })
              .catch((err: any) => {
                MsgBox.error("删除失败");
              });
          },
        ],
      ]);
      let action: any = todo.get(this.alertTitle.slice(2));
      action.call(this);
    }
  }
  btnClick(event: any) {
    this.alertTitle = `确认${event.type}`;
    this.alertShow = true;
  }
  handleClick(event: any) {
    let obj = {};
    if (event.clickType === "left") {
      this.$router.push({ name: "apply" });
    }
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
  background: #e5edfd;
}
</style>