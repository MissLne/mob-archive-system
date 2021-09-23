<template>
  <div id="apply-item">
    <router-view></router-view>
    <div>申请编号：{{ applyItem.applyCode }}</div>
    <div v-for="(item, index) in item" :key="index">
      <div>{{ item.text }}</div>
      <div>{{ item.content }}</div>
    </div>
    <div>
      <div>{{ applyItem.status }}</div>
      <router-link :to="{ name: 'editApply', params: { id: applyItem.id } }" >查看</router-link>
    </div>
    ________
    <br />
    ________
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
export default class ApplyItem extends Vue {
  @Prop({}) private applyItem!: any;
  private item: Array<ItemTyle> = [
    {
      text: "申请原因",
      content: "",
      type: "applyReason",
    },
    {
      text: "申请内容",
      content: "",
      type: "applyContent",
    },
    {
      text: "部门",
      content: "",
      type: "departmentName",
    },
    {
      text: "申请时间",
      content: "",
      type: "applyTime",
    },
    {
      text: "期限",
      content: "",
      type: "deadline",
    },
  ];
  initData() {
    for (let i = 0; i < this.item.length; i++) {
      this.item[i].content = this.applyItem[this.item[i].type];
    }
  }
  created() {
    this.initData();
  }
}
</script>
<style lang="less">
</style>