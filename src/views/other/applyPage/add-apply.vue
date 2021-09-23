<template>
  <div id="add-apply">
    <div>
      <div>
        <div>
          <p>部门</p>
          <p>{{ addData.departmentName }}</p>
        </div>
        <div>
          <p>申请人</p>
          <p>{{ addData.username }}</p>
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
        <div @click="tempSave">暂存</div>
        <div @click="submit">提交</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
interface obj {
  username: string;
  departmentName: string;
  applyContent: string;
  applyReason: string;
  [key: string]: string;
}
@Component
export default class AddApply extends Vue {
  private addData: obj = {
    username: "",
    departmentName: "",
    applyContent: "",
    applyReason: "",
  };

  created() {
    this.initData();
  }
  initData() {
    this.addData.username = localStorage.getItem("username") || "";
    (this as any).$request
      .get("/api/api/department/getDepartmentTree", {
        id: localStorage.getItem("departmentId"),
      })
      .then((res: any) => {
        this.addData.departmentName = res.data.data.departmentName;
      });

    if (this.$route.params.type === "编辑") {
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
  tempSave() {
    
  }
}
</script>
<style lang="less">
</style>