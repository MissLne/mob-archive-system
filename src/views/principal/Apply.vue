<template>
  <div id="apply">
    <SideBar :sideBarShow="sideBarShow" />
    <DesHead :headData="headData" @handleClick="handleClick($event)" />
    <DesSearch
      :searchText="searchText"
      :isDate="true"
      @onConfirm="onConfirm($event)"
    />
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
    <!-- <transition name="delete-cancel">
      <div class="select-btn" v-if="isShow">
        <div @click="cancelSelect">返回</div>
        <div @click="alertShow = true">删除</div>
      </div>
    </transition> -->

    <DesBtn
      @changePage="changePage($event)"
      :totalPage="pageData"
      v-if="pageData.total"
    />
    <Alerts
      :title="'确认删除'"
      v-if="alertShow"
      @sureDelete="sureDelete($event)"
    />
    <img
      v-show="!sideBarShow"
      :src="isShow? btnUrl[1] : btnUrl[0]"
      class="add-apply"
      @click="toAddPage(isShow)"
    />
    <div class="slots2"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
Component.registerHooks([
  "beforeRouteLeave",
  "beforeRouteUpdate",
  "beforeRouteEnter",
]);
import ApplyItem from "@/components/apply-com/index/apply-item.vue";
import DesHead from "@/components/des-com/index/des-head.vue";
import DesSearch from "@/components/des-com/index/des-search.vue";
import Alerts from "@/components/tools/alerts.vue";
import MsgBox from "@/components/public-com/MsgBox/Msg";
import DesBtn from "@/components/des-com/index/des-btn.vue";
import SideBar from "@/components/public-com/SideBar.vue";
import store from "@/store";

@Component({
  components: {
    ApplyItem,
    DesHead,
    DesSearch,
    Alerts,
    DesBtn,
    SideBar,
  },
})
export default class Apply extends Vue {
  private btnUrl = [require("@/assets/apply/Addapplication.png"),require("@/assets/index/delete.png")]
  public sideBarShow: boolean = false;
  private idList: Array<number> = [];
  private alertShow: boolean = false;
  private searchText: string = "";
  private itemData: any[] = [];
  private checkList: Array<boolean> = [];
  private isShow: boolean = false;
  private seletList: any[] = [
    require("@/assets/index/unselect.png"),
    require("@/assets/index/doselect.png"),
  ];
  public pageData: any = {
    current: 1,
    total: 0,
    time: "",
  };
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
  private isFlag: boolean = false
  // @Watch("$route")
  // watchSlotRoute(to: any, from: any) {
  //   if (from.name == "apply" && to.name != "editApply") {
  //     console.log("w s ")
  //     from.$route.meta.keepAlive = false

  //   } else if (from.name == "apply" && to.name == "editApply") {
  //     from.$route.meta.keepAlive = true
  //     console.log("wsss")
  //   }
  // }

  // activated() {
  //   console.log((this as any).$route.meta.isBack);
  // }
  beforeRouteEnter(to: any, from: any, next: any) {
    if (!store.state.isDetailPage) {
      next((vm: any) => {
        vm.doSth(vm)
      });
    } else {
      next();
    }
  }
  doSth(vm: any) {
    vm.searchText = "";
    vm.pageData.time = vm.searchText;
    vm.pageData.current = 1;
    vm.getList();
  }
  //  beforeRouteUpdate (to: any,from: any,next: any) {
  //    console.log("to:"+to.name,"from:"+from.name,)
  //    if (from.name != "editApply") {

  //     this.created()
  //   }
  //   next()
  // }
  searchThings(event: any) {
    this.pageData.time = event.searchVal;
    this.pageData.current = 1;
    this.getList();
    console.log(event);
  }
  async onConfirm(event: any) {
    this.searchText = event.date;
    this.pageData.time = event.date;
    this.pageData.current = 1;
    this.getList();
    await this.getList();
    
  }
  getList(): void {
    let data = {
      current: this.pageData.current,
      applyTime: this.pageData.time,
    };
    if (!this.pageData.time) {
      delete data.applyTime;
    } else {
      data.applyTime = this.pageData.time;
    }
    (this as any).$request
      .post("/api/api/use/getMyUseApplyList", {
        ...data,
      })
      .then((res: any) => {
        let result = this.changeStatus(res.data.data.records);
        console.log(res.data.data);
        if (res.data.data.records.length == 0) {
          MsgBox.error("内容为空");
        }
        this.itemData = result;
        // result.map((item, index) => {
        //   this.$set(this.itemData, index, item);
        // });
        this.$set(this.pageData,'total',Math.ceil(res.data.data.total / 10))
        console.log(this.pageData.total,'total');
        (this as any).$refs.desBtnvue.initPageData(this.pageData.total)
        // this.pageData.total = Math.ceil(res.data.data.total / 10);
        this.checkList = new Array(this.itemData.length).fill(false);
        this.idList = [];
        for (let i = 0; i < this.itemData.length; i++) {
          this.idList.push(this.itemData[i].id);
        }
      });
  }
  changePage(event: any): void {
    if (event && this.pageData.current) {
      if (event.type === "prePage" && this.pageData.current > 1) {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.pageData.current--;
        this.getList();
      } else if (
        event.type === "nextPage" &&
        this.pageData.current < this.pageData.total
      ) {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.pageData.current++;
        this.getList();
      } else {
        this.$nextTick(() => {
          window.scrollTo(0, 0);
        });
        this.pageData.current = event.page;
        this.getList();
      }
    }
  }
  toAddPage(addOrdel: boolean) {
    if(addOrdel) {
      this.alertShow = true
    } else {
      this.$router.push({ name: "addApply" });
    }
  }
  changeStatus(arr: any[]) {
    let data = new Map([
      [0, "申请"],
      [1, "审批"],
      [2, "同意"],
      [3, "拒绝"],
      [4, "完成"],
      [5, "延期"],
    ]);
    let str = arr.map((item: any) => {
      item.hasOwnProperty("status") && (item.status = data.get(item.status));
      return item;
    });
    return str;
  }
  deleteItem() {
    let deleteId: Array<number> = [];
    this.checkList.map((item, index) => {
      if (item) deleteId.push(this.idList[index]);
    });
    return deleteId;
  }
  sureDelete(event: any) {
    if (event.type === "not") {
      this.alertShow = false;
    } else {
      this.alertShow = false;
      let list: Array<number> = this.deleteItem();
      console.log(list);
      this.$request
        .post("/api/api/use/deleteUseApply", [...list])
        .then((res: any) => {
          if (res.data.success === true) {
            MsgBox.success("删除成功");
            this.cancelSelect();
            this.getList();
            return;
          }
          throw new Error();
        })
        .catch((err: any) => {
          this.cancelSelect();
          MsgBox.error("删除失败");
        });
    }
  }
  checkItem(index: number) {
    this.$set(this.checkList, index, !this.checkList[index]);
    this.checkList.forEach((item) => {
      if(!item) this.headData.rightText =  "全选"
    })
  }
  cancelSelect() {
    this.isShow = false;
    this.isFlag = false
    let obj = {
      leftUrl: "3",
      leftPic: true,
      rightPic: false,
      rightText: "选择",
      leftText: "",
    };
    this.sideBarShow ? (obj.leftUrl = "4") : (obj.leftUrl = "3");
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
          leftUrl: "",
          leftPic: false,
          leftText: "返回",
          rightText: "全选",
        };
        this.headData = Object.assign(this.headData, obj);
        return;
      }
      if(this.headData.rightText === "全选") {
        this.initSelect(true);
        this.headData.rightText =  "取消"
      } else if(this.headData.rightText === "取消"){
        this.initSelect(false);
        this.headData.rightText =  "全选"
      }
    } else {
      if (this.headData.leftText === "返回") {
        this.cancelSelect()
        return;
      }

      if (this.headData.leftUrl == "4") {
        obj = {
          leftUrl: "3",
          leftPic: true,
          rightText: "选择",
        };
        this.headData = Object.assign(this.headData, obj);
        this.sideBarShow = false;
      } else if (this.headData.leftUrl == "3") {
        obj = {
          leftUrl: "4",
          leftPic: true,
          rightText: "",
        };
        this.headData = Object.assign(this.headData, obj);
        this.sideBarShow = true;
      }
    }
  }
  created() {
    this.getList();
  }
  deactivated() {
    this.sideBarShow = false;
  }
}
</script>
<style lang="scss">
#apply {
  .delete-cancel-enter-active {
    // transition: 0.8s;
    animation: enters 1s;
  }
  .delete-cancel-leave-active {
    // transition: 0.8s;
    animation: leves 0.7s;
  }
  @keyframes leves {
    0% {
      bottom: 100px;
    }
    100% {
      bottom: -100px;
    }
  }
  @keyframes enters {
    0% {
      bottom: -100px;
    }
    100% {
      bottom: 100px;
    }
  }
  .add-apply {
    position: fixed;
    width: 82px;
    height: 82px;
    bottom: 100px;
    right: 30px;
    z-index: 1;
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