<template>
  <div id="apply-item">
    
    <div class="header">
      <div :style="{color: classColor}">{{ applyItem.status }}</div>
      <div>{{ applyItem.applyCode }}</div>
    </div>
    <div class="item-body">
      <div v-for="(item, index) in item" :key="index">
        <div>{{ item.text }}</div>
        <div>{{ item.content }}</div>
      </div>
    </div>
    <div class="lookbtn">
      <router-link
        :to="{ name: 'editApply', params: { id: applyItem.id } }"
        class="look"
        >查看</router-link
      >
    </div>
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
@Component({
  components: {
  }
})
export default class ApplyItem extends Vue {
  @Prop({}) private applyItem!: any;
    
  private classColor: string = ""
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
  ];
  initData() {
    for (let i = 0; i < this.item.length; i++) {
      this.item[i].content = this.applyItem[this.item[i].type];
    }
    let data = new Map([
          ["申请","#800CE8"],
          ["审批","#EB2D02"],
          ["同意","#12DB00"],
          ["拒绝","#EB2D02"],
          ["完成","#8EBEFE"],
          ["延期","#F2C10C"]
        ]);
        this.classColor = data.get(this.applyItem.status) || ""
  }
  created() {
    this.initData();
    
  }
  updated() {
    this.initData();
  }
}
</script>
<style lang="scss">
#apply-item {
  color: #666;
  width: 690px;
  height: 331px;
  box-sizing: border-box;
  padding: 30px 37px 20px 35px;
  border-radius: 12px;
  background: #ffffff;
  border-radius: 12px;
  margin: 20px auto 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
  .header {
    display: flex;
    justify-content: flex-start;
    font-size: 30px;

    > div:nth-of-type(1) {
      margin-right: 48px;
    }
  }
  .item-body > div {
    display: flex;
    justify-content: flex-start;
    font-size: 28px;
    margin-bottom: 25px;
    > div:nth-of-type(1) {
      margin-right: 108px;
      white-space: nowrap;
    }
    > div:nth-of-type(2) {
      color: #999;
      width: 399px;
      padding-bottom: 27px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-bottom: 1px solid #e1e1e1;
    }
  }
  .lookbtn {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .look {
    display: inline-block;
    width: 78px;
    height: 40px;
    background: #85b8fd;
    border-radius: 8px;
    color: #fff;
    font-size: 22px;
    text-align: center;
    line-height: 40px;
    box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
  }
}
</style>