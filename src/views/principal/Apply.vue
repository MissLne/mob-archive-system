<template>
  <div id="apply">
    <DesHead :headData="headData"  @handleClick="handleClick($event)"/>
    <DesSearch :searchText="searchText" />
    <div class="slots"></div>
    <div v-for="(item, index) in itemData" :key="index" class="item-box">
      <ApplyItem :applyItem="item" />
      <img
        class="manySelect"
        :src="checkList[index] ? seletList[1] : seletList[0]"
        v-show="isShow"
        @click="checkItem(index)"
      />
    </div>
    <div class="select-btn" v-if="isShow">
      <div @click="cancelSelect">取消</div>
      <div @click="alertShow = true">删除</div>
    </div>
     <Alerts
      :title="'确认删除'"
      v-if="alertShow"
      @sureDelete="sureDelete($event)"
    />
    <img src="@/assets/apply/Addapplication.png" class="add-apply" @click="toAddPage"/>
    <div class="slots2"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ApplyItem from "@/components/apply-com/index/apply-item.vue";
import DesHead from "@/components/des-com/index/des-head.vue";
import DesSearch from "@/components/des-com/index/des-search.vue";
import Alerts from "@/components/tools/alerts.vue";
import MsgBox from "@/components/public-com/MsgBox/Msg";

@Component({
  components: {
    ApplyItem,
    DesHead,
    DesSearch,
    Alerts
  },
})
export default class Apply extends Vue {
  private idList: Array<number> = []
  private alertShow: boolean = false;
  private searchText: string = "请输入时间搜索";
  private itemData: any[] = [];
  private checkList: Array<boolean> = [];
  private isShow: boolean = false;
  private seletList: any[] = [
    require("@/assets/index/unselect.png"),
    require("@/assets/index/doselect.png"),
  ];
  public headData: any = {
    title: "借阅申请",
    leftUrl: "3",
    rightUrl: "",
    leftPic: true,
    rightPic: false,
    leftText: "",
    rightText: "选择",
    isShow: false,
  };
  getList(): void {
    (this as any).$request
      .post("/api/api/use/getMyUseApplyList", {})
      .then((res: any) => {
        this.itemData = this.changeStatus(res.data.data.records);
        this.checkList = new Array(this.itemData .length).fill(false);
        for(let i = 0;i < this.itemData.length;i++) {
          this.idList.push(this.itemData[i].id)
        }
      });
  }
  toAddPage() {
    this.$router.push({name: 'addApply'})
  }
  changeStatus(arr: any[]) {
    let data = new Map([
      [0, "申请"],
      [1, "审批"],
      [2, "同意"],
      [3, "拒绝"],
      [4, "完成"],
    ]);
    let str = arr.map((item: any) => {
      item.status && (item.status = data.get(item.status));
      return item;
    });
    return str;
  }
     deleteItem() {
    let deleteId: Array<number> = []
    this.checkList.map((item,index) => {
      if(item) deleteId.push(this.idList[index])
    })
    return deleteId
  }
  sureDelete(event: any) {
    if(event.type === 'not') {
      this.alertShow = false
    } else {
      this.alertShow = false
      let list: Array<number> = this.deleteItem()
      console.log(list);
      this.$request
          .post("/api/api/use/deleteUseApply", [...list])
          .then((res: any) => {
            if (res.data.success === true) {
              MsgBox.success("删除成功");
              this.cancelSelect();
              this.getList();
              return
            }
            throw new Error()
          })
          .catch((err: any) => {
            this.cancelSelect();
            MsgBox.error("删除失败");
          });
    }
  }
  checkItem(index: number) {
    this.$set(this.checkList, index, !this.checkList[index]);
  }
    cancelSelect() {
    this.isShow = false;

    let obj = {
      leftUrl: "3",
      leftPic: true,
      rightPic: false,
      rightText: "选择",
      leftText: "",
    };
    this.headData = Object.assign(this.headData, obj);
  }
  initSelect(type: boolean) {
    this.checkList.forEach((value, index) => {
      this.$set(this.checkList, index, type);
    });
  }
  handleClick(event: any) {
    let obj = {};
    if (event.clickType === "right") {
      if (this.headData.rightText === "选择") {
        this.initSelect(false);
        this.isShow = true;
        obj = {
          leftUrl: "1",
          leftText: "取消",
          rightText: "全选",
        };
        this.headData = Object.assign(this.headData, obj);
        return;
      }
      this.initSelect(true);
    } else {
      if (this.headData.leftUrl === "1") {
        this.initSelect(false);
        return;
      }

      if (this.headData.leftUrl == "4") {
        this.headData.leftUrl = "3";
      } else {
        this.headData.leftUrl = "4";
      }
    }
  }
  created() {
    this.getList();
  }
}
</script>
<style lang="scss">
#apply {
  .add-apply {
    position: fixed;
    width: 82px;
    height: 82px;
    bottom: 100px;
    right: 42px;
    z-index: 999;
  }
  .select-btn {
    width: 519px;
    z-index: 999;
    position: fixed;
    transform: translateX(-50%);
    bottom: 100px;
    left: 50%;
    display: flex;
    justify-content: space-between;
    > div:nth-of-type(1),
    > div:nth-of-type(2) {
      width: 162px;
      height: 75px;
      box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
      border-radius: 8px;
      font-size: 42px;
      text-align: center;
      line-height: 75px;
    }
    > div:nth-of-type(1) {
      color: #ffffff;
      background: #85b8fd;
    }
    > div:nth-of-type(2) {
      color: #ff0000;
      background: #fff;
    }
  }
  .slots {
    height: 222px;
  }
  .slots2 {
    height: 90px;
  }
  .item-box {
    position: relative;
    width: 690px;
    height: 331px;
    margin: 20px auto 0 auto;
    .manySelect {
      width: 47px;
      height: 47px;
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
  min-height: 100vh;
  width: 750px;
  background: #ebf2fe;
}
</style>