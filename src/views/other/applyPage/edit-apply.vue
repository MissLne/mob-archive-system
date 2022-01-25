<template>
  <div id="editApply">
    <des-head @handleClick="handleClick($event)">详情</des-head>
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
import SlideWrapper from "@/components/public-com/Slide/SlideWrapper.vue";
import Details from "@/components/apply-com/edit/details.vue";
import DesHead from "@/components/des-com/index/des-head.vue";
import FileData from "@/components/apply-com/edit/fileData.vue";
import MsgBox from "@/components/public-com/MsgBox/Msg";
import { getSrcCertainly } from "@/utils/picture";
import { Dialog } from 'vant'

@Component({
  components: {
    Details,
    DesHead,
    FileData,
    SlideWrapper,
  },
})
export default class editApply extends Vue {
  public detailData: any = "";
  private showId: Array<number> = [];
  private count: number = 1;
  public justCount: number = 0;
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
  /**
   * 确认删除后的操作
   * @param event 操作的名称
   */
  sureDelete(event: "撤回" | "删除") {
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
    let action: any = todo.get(event);
    action.call(this);
  }
  private handleDetailId: number = 0;
  btnClick(event: any) {
    this.handleDetailId = event.id;
    // 弹出Dialog，确认就触发sureDelte函数
    Dialog.confirm({ title: `确认${event.type}` })
      .then(() => this.sureDelete(event.type))
      .catch(() => {})
  }
  handleClick(event: any) {
    let obj = {};
    if (event.clickType === "left") {
      // store.commit("setDetailPage");
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