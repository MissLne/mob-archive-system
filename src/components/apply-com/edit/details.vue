<template>
  <div id="details">
    
    <div class="itemDetail">
      <div v-for="(item, index) in item" :key="index">
        <div>{{ item.text }}</div>
        <div>{{ item.content }}</div>
      </div>
    </div>
    <div>
      <div class="applyADelete" v-if="detailData.status === '申请'">
        <router-link
          :to="{
            name: 'addApply',
            params: { type: '编辑', id: detailData.id },
          }"
          class="edit"
          >编辑</router-link
        >
        <div @click="btnClick('删除')">删除</div>
      </div>
      <div
        v-if="detailData.status === '审批'"
        @click="btnClick('撤回')"
        class="cancel"
      >
        撤回
      </div>
    </div>
    <div v-if="detailData.status === '完成'" class="success">
      <div>
        <p>审批状态</p>
        <div>{{ agreeData.status }}</div>
      </div>
      <div>
        <p>审批意见</p>
        <p>{{ agreeData.result }}</p>
      </div>
      <div>
        <p>审批人</p>
        <p>{{ agreeData.name }}</p>
      </div>
      <div>
        <p>审批日期</p>
        <p>{{ agreeData.createTime }}</p>
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
    result: "",
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
      console.log(this.detailData);

      for (let key in this.agreeData) {
        this.agreeData[key] = this.detailData.useReviewListBoList[0][key];
      }
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
#details {
  width: 700.3px;
  background: #fff;
  margin: 0 auto;
  padding: 22px 0 29px 0;
  font-size: 28px;
  .itemDetail {
    margin: 0 43px 0 44px;
    > div {
      > div:nth-of-type(1) {
        color: #666;
      }
      > div:nth-of-type(2) {
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 400px;
        padding-bottom: 27px;
        border-bottom: 1px solid #e1e1e1;
        margin-bottom: 25px;
      }
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    > div:nth-of-type(4),
    > div:nth-of-type(5) {
      > div:nth-of-type(2) {
        color: #999;
        word-wrap: break-word;
        width: 100%;
        padding-bottom: 40px;
        border-bottom: 1px solid #e1e1e1;
        margin: 19px 0 25px 0;
      }
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
    }
  }
  .success {
    margin: 0 43px 0 44px;
    > div {
      > p:nth-of-type(1) {
        color: #666;
      }
      > p:nth-of-type(2) {
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 400px;
        padding-bottom: 27px;
        border-bottom: 1px solid #e1e1e1;
        margin-bottom: 25px;
      }
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    > div:nth-of-type(1) {
      margin-bottom: 53px;
    }
  }
  .cancel {
    width: 622px;
    height: 75px;
    background: #85b8fd;
    box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
    border-radius: 8px;
    font-weight: 400;
    font-size: 35px;
    color: #ffffff;
    line-height: 75px;
    text-align: center;
    margin: 143px auto 0 auto;
  }
  .applyADelete {
    width: 622px;
    height: 75px;
    margin: 143px auto 0 auto;
    display: flex;
    justify-content: space-between;
    .edit {
      display: inline-block;
      background: #85b8fd;
      color: #ffffff;
    }
    > div:nth-of-type(1){
      
      background: #ffffff;
      color: #ff0000;
    }
    > div:nth-of-type(1),
    .edit {
      width: 162px;
      height: 75px;
      box-shadow: 0px 3px 7px 0px rgba(143, 143, 143, 0.35);
      border-radius: 8px;
      font-size: 35px;
      text-align: center;
      line-height: 75px;
    }
  }
}
</style>