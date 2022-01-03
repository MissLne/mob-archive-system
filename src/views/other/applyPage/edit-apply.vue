<template>
  <div id="editApply">
    <Alerts
      :title="alertTitle"
      v-if="alertShow"
      @sureDelete="sureDelete($event)"
    />
    <DesHead :headData="headData" @handleClick="handleClick($event)" />
    <div class="slots"></div>
    <!-- <Details
      v-if="detailData"
      :detailData="detailData"
      @btnClick="btnClick($event)"
    />
    <FileData :fileData="fileData" v-if="fileData.length" /> -->
    <SlideWrapper
      :isCurCle="true"
      :maxLength="$store.state.applyIdList.length"
      @setPages="onSetPages($event)"
    >
      <div
        style="width: 100vw"
        v-for="(item, index) in $store.state.applyIdList"
        :key="item"
      >
        <Details
          v-if="
            item &&
            index > $store.state.applyIdIndex - 2 &&
            index < $store.state.applyIdIndex + 2
          "
          :iditem="item"
          @btnClick="btnClick($event)"
        />
        <FileData
          :fileDataId="item"
          v-if="
            item &&
            index > $store.state.applyIdIndex - 2 &&
            index < $store.state.applyIdIndex + 2
          "
        />
      </div>
    </SlideWrapper>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SlideWrapper from "@/components/public-com/Slide/SlideWrapper";
import Details from "@/components/apply-com/edit/details.vue";
import DesHead from "@/components/des-com/index/des-head.vue";
import FileData from "@/components/apply-com/edit/fileData.vue";
import Alerts from "@/components/tools/alerts.vue";
import MsgBox from "@/components/public-com/MsgBox/Msg";
import store from "@/store";
import { getSrcCertainly } from "@/utils/picture";

@Component({
  components: {
    Details,
    DesHead,
    FileData,
    Alerts,
    SlideWrapper,
  },
})
export default class editApply extends Vue {
  public detailData: any = "";
  private alertTitle: string = "";
  private showId: Array<number> = [];
  private alertShow: boolean = false;
  private count: number = 1;
  public justCount: number = 0;
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
  public componentData: any[] = [];
  public maxLength: number = 5;
  onSetPages(event: any) {
    if (event.corect == -1) {
      this.$store.commit("setApplyIdIndex", this.$store.state.applyIdIndex + 1);
    } else if (event.corect == 1) {
      this.$store.commit("setApplyIdIndex", this.$store.state.applyIdIndex - 1);
    }
  }
  async created() {
    window.scrollTo(0,0)
    if (!this.$store.state.applyIdList.length) {
      let list = typeof this.$route.query.idList == "string"? this.$route.query.idList.split(",") : []
      let idIndex = Number(this.$route.query.idIndex)
      this.$store.commit("setApplyIdIndex", idIndex);
      this.$store.commit("setApplyIdList", list);
      this.maxLength = list.length;
    }
  }
  activated() {
    // this.getDetail(this.$route.query.id, 1);
  }
  async getDetail(ids: any, num: number) {
    let details = await (this as any).$request
      .get("/api/api/use/getUseApplyDetail", { id: ids })
      .then((res: any) => {
        // console.log(this.$route.query, res.data.data);
        console.log(this.$route.query, res.data.data);
        let result = { ...res.data.data, id: ids };

        let data = new Map([
          [0, "申请"],
          [1, "审批"],
          [2, "同意"],
          [3, "拒绝"],
          [4, "完成"],
        ]);

        result.status = data.get(result.status);
        return result;
      });
    let detailFile = await this.$request
      .get("/api/api/use/getMyUseResultByUseApplyId", { id: ids })
      .then((res: any) => {
        let result = res.data.data;
        Array.isArray(result) &&
          result.forEach(async (item: any) => {
            if (item.fileType)
              item.fileToken = await getSrcCertainly(
                item.fileType,
                item.fileToken,
                true
              );
          });
        // this.fileData = result;
        return result;
        console.log(this.fileData, ")))))))))))");
      });
    // this.$nextTick(() => {
    this.$set(this.componentData, num, [details, detailFile]);
    // });
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
                // id: [`${this.$route.query.id}`]
                [`${this.handleDetailId}`]
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
              .post("/api/api/use/deleteUseApply", [`${this.handleDetailId}`])
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
  private handleDetailId: number = 0;
  btnClick(event: any) {
    this.alertTitle = `确认${event.type}`;
    this.handleDetailId = event.id;
    this.alertShow = true;
  }
  handleClick(event: any) {
    let obj = {};
    if (event.clickType === "left") {
      store.commit("setDetailPage");
      this.$router.push({ name: "apply" });
    }
  }
}
</script>
<style lang="scss">
#editApply {
  width: 100vw;
  min-height: 100vh;
  background: #e5edfd;
}
</style>