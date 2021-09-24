<template>
  <div id="add-apply">
    <div>
      <div>
        <div>
          <p>部门</p>
          <p>{{ readData.departmentName }}</p>
        </div>
        <div>
          <p>申请人</p>
          <p>{{ readData.username }}</p>
        </div>
      </div>
      <div>
        <div>
          <p>申请原因</p>
          <textarea v-model="addData.applyReason"></textarea>
        </div>
        <div>
          <p>申请内容</p>
          <textarea v-model="addData.applyContent"></textarea>
        </div>
      </div>
      <div>
        <div @click="submit(0)">暂存</div>
        <div @click="submit(1)">提交</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
interface write {
  applyContent: string;
  applyReason: string;
  status: number;
  [key: string]: string | number;
}
interface read {
  username: string;
  departmentName: string;
  [key: string]: string;
}
@Component
export default class AddApply extends Vue {
  private readData: read = {
    username: "",
    departmentName: "",
    applyContent: "",
    applyReason: "",
  };
  private addData: write = {
    applyContent: "",
    applyReason: "",
    status: 0,
  };
  created() {
    this.initData();
  }
  initData() {
    this.readData.username = localStorage.getItem("username") || "";
    (this as any).$request
      .get("/api/api/department/getDepartmentTree", {
        id: localStorage.getItem("departmentId"),
      })
      .then((res: any) => {
        this.readData.departmentName = res.data.data.departmentName;
      });

    if (this.$route.params && this.$route.params.type === "编辑") {
      (this as any).$request
        .get("/api/api/use/getUseApplyDetail", {
          id: this.$route.params.id,
        })
        .then((res: any) => {
          this.addData.applyContent = res.data.data.applyContent;
          this.addData.applyReason = res.data.data.applyReason;
        });
    }
  }
  submit(num: number) {
    console.log(1);

    if (this.$route.params && this.$route.params.type === "编辑") {
      let dothing = new Map([
        [
          0,
          () => {
            (this as any).$request
              .post("/api/api/use/updateUseApply", {
                id: this.$route.params.id,
                departmentId: localStorage.getItem("departmentId"),
                ...this.addData,
              })
              .then((res: any) => {
                console.log(res);
              });
          },
        ],
        [
          1,
          () => {
            (this as any).$request
              .post("/api/api/use/updateUseApply", {
                id: this.$route.params.id,
                departmentId: localStorage.getItem("departmentId"),
                ...this.addData,
              })
              .then(() => {
                (this as any).$request.get("/api/api/use/submitUseApply", {
                  id: this.$route.params.id,
                });
              });
          },
        ],
      ]);
      let action: any = dothing.get(num);
      action.call(this);
    } else {
      this.addData.status = num;
      (this as any).$request.post("/api/api/use/useApply", this.addData);
    }
  }
}
</script>
<style lang="less">
</style>