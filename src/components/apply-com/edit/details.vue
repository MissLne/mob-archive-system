<template>
  <div id="details">
    <div>
      <div v-for="(item, index) in item" :key="index">
        <div>{{ item.text }}</div>
        <div>{{ item.content }}</div>
      </div>
    </div>
    <div>
      <router-link
        :to="{ name: 'addApply', params: { type: '编辑', id: detailData.id } }"
        v-if="detailData.status === '申请'"
        >编辑</router-link
      >
      <div v-if="detailData.status === '申请'" @click="btnClick('删除')">
        删除
      </div>
      <div v-if="detailData.status === '审批'" @click="btnClick('撤回')">
        撤回
      </div>
    </div>
    <div v-if="detailData.status === '完成'">
      <div>
        <p>审批状态</p>
        <div>{{agreeData.status}}</div>
      </div>
      <div>
        <p>审批人</p>
        <p>{{agreeData.name}}</p>
      </div>
      <div>
        <p>审批日期</p>
        <p>{{agreeData.createTime}}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { StepRenderSlots } from "element-ui/types/step";
import { Component, Prop, Vue } from "vue-property-decorator";

interface ItemTyle {
  text: string;
  content: string;
  type: string;
  [key: string]: any;
}

interface ItemData {
  name: string;
  status: string | number;
  createTime: string;
  [key: string]: any;
}
@Component
export default class Details extends Vue {
  @Prop({}) private detailData!: any;
  private item: Array<ItemTyle> = [
    {
      text: "申请编号",
      content: "",
      type: "applyCode",
    },
    {
      text: "状态",
      content: "",
      type: "status",
    },
    {
      text: "部门",
      content: "",
      type: "departmentName",
    },
    {
      text: "申请原因：",
      content: "",
      type: "applyReason",
    },
    {
      text: "申请内容：",
      content: "",
      type: "applyContent",
    },
    {
      text: "申请人",
      content: "",
      type: "applyName",
    },
    {
      text: "申请时间",
      content: "",
      type: "applyTime",
    },
  ];
  private agreeData: ItemData = {
    name: "",
    status: 0,
    createTime: "",
  };
  initData() {
    

    for (let i = 0; i < this.item.length; i++) {
      this.item[i].content = this.detailData[this.item[i].type];
    }
    if (this.detailData.status === "完成") {
      let data = new Map([
        [0, "同意"],
        [1, "拒绝"],
        [2, "转交"],
      ]);
      this.detailData.useReviewListBoList[0].status = data.get(
        this.detailData.useReviewListBoList[0].status
      );
      for (let key in this.agreeData) {
        this.agreeData[key] = this.detailData.useReviewListBoList[0][key];
      }
    }
    console.log(this.detailData.useReviewListBoList[0]);
    
    console.log(this.agreeData);
  }
  btnClick(str: string) {
    this.$emit("btnClick", { type: str });
  }
  created() {
    this.initData();
  }
}
</script>
<style lang="scss">
.ttt {
  background: transparent;
  border: none;
}
</style>