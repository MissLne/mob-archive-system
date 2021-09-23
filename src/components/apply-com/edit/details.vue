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
        :to="{ name: 'addApply',params: {type: '编辑',id: detailData.id}}"
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
    <div v-if="detailData.status === '完成'"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

interface ItemTyle {
  text: string;
  content: string;
  type: string;
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
  initData() {
    for (let i = 0; i < this.item.length; i++) {
      this.item[i].content = this.detailData[this.item[i].type];
    }
    
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