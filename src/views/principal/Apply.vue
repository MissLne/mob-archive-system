<template>
  <div id="apply">
    <SideBar :sideBarShow="sideBarShow" />
    <des-head
      @handleClick="handleClick($event)"
    >
      借阅申请
      <template #left="{pics}">
        <!-- 正在选择 -->
        <span v-if="isChecking">返回</span>
        <!-- 常规状态 -->
        <img v-else :src="sideBarShow ? pics[4] : pics[3]">
      </template>
      <template #right>
        {{sideBarShow ? '' : (isChecking ? isAllSelect ? '取消' : '全选' : '选择')}}
      </template>
    </des-head>
    <DesSearch
      :searchText="searchText"
      :isDate="true"
      @onConfirm="onConfirm($event)"
    />
    <div class="slots"></div>
    <div v-for="(item, index) in itemData" :key="index" class="item-box">
      <ApplyItem :applyItem="item" :idList="idList" :idIndex="index"/>
      <img
        class="manySelect"
        :src="checkList[index] ? seletList[1] : seletList[0]"
        v-show="isChecking"
        @click="checkItem(index)"
      />
    </div>
    <!-- <transition name="delete-cancel">
      <div class="select-btn" v-if="isChecking">
        <div @click="cancelSelect">返回</div>
        <div @click="alertShow = true">删除</div>
      </div>
    </transition> -->

    <PageBtn
      :pageTotal="pageTotal"
      :pageCur="pageCur"
      @changePage="changePage"
    />
    <Alerts
      :title="'确认删除'"
      v-if="alertShow"
      @sureDelete="sureDelete($event)"
    />
    <img
      v-show="!sideBarShow"
      :src="isChecking? btnUrl[1] : btnUrl[0]"
      class="add-apply"
      @click="toAddPage(isChecking)"
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
import editApply from "@/views/other/applyPage/edit-apply.vue"

import ApplyItem from "@/components/apply-com/index/apply-item.vue";
import DesHead from "@/components/des-com/index/des-head.vue";
import DesSearch from "@/components/des-com/index/des-search.vue";
import Alerts from "@/components/tools/alerts.vue";
import MsgBox from "@/components/public-com/MsgBox/Msg";
import PageBtn from "@/components/public-com/PageBtn.vue";
import SideBar from "@/components/public-com/SideBar.vue";
import store from "@/store";

@Component({
  components: {
    ApplyItem,
    DesHead,
    DesSearch,
    Alerts,
    PageBtn,
    SideBar,
    editApply
  },
})
export default class Apply extends Vue {
  private btnUrl = [require("@/assets/button/add-application.png"),require("@/assets/button/delete.png")]
  public sideBarShow: boolean = false;
  private idList: Array<number> = [];
  private alertShow: boolean = false;
  private searchText: string = "";
  private itemData: any[] = [];
  private checkList: Array<boolean> = [];
  private isChecking: boolean = false;
  private seletList: any[] = [
    require("@/assets/index/unselect.png"),
    require("@/assets/index/doselect.png"),
  ];
  public pageData: any = {
    current: 1,
    total: 0,
    time: "",
  };
  public pageCur: number = 1
  public pageTotal: number = 0
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
  // beforeRouteEnter(to: any, from: any, next: any) {
  //   if (!store.state.isDetailPage) {
  //     next((vm: any) => {
  //       vm.doSth(vm)
  //     });
  //   } else {
  //     next();
  //   }
  // }
  doSth(vm: any) {
    vm.searchText = "";
    vm.pageData.time = vm.searchText;
    vm.pageCur = 1;
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
    this.pageCur = 1;
    this.getList();
    console.log(event);
  }
  async onConfirm(event: any) {
    this.searchText = event.date;
    this.pageData.time = event.date;
    this.pageCur = 1;
    this.getList();
    await this.getList();
    
  }
  getList(): void {
    let data = {
      current: this.pageCur,
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
        // console.log(res.data.data);
        if (res.data.data.records.length == 0) {
          MsgBox.error("内容为空");
        }
        this.itemData = result;
        console.log(result)
        // result.map((item, index) => {
        //   this.$set(this.itemData, index, item);
        // });
        this.$set(this.pageData,'total',Math.ceil(res.data.data.total / 10))
        this.pageTotal = Math.ceil(res.data.data.total / 10)
        console.log(this.pageTotal,'total');
        this.checkList = new Array(this.itemData.length).fill(false);
        this.idList = [];
        for (let i = 0; i < this.itemData.length; i++) {
          this.idList.push(this.itemData[i].id);
        }
      });
  }
  changePage(page: number | null) {
    if (page === null)
      return;
    // if (event && this.getListData.current)
    this.$nextTick(() => {
      window.scrollTo(0, 0);
    });
    this.pageCur = page;
    this.getList();
  }
  toAddPage(addOrdel: boolean) {
    if(addOrdel) {
      this.alertShow = true
    } else {
      this.$router.push({ name: "addApply",query: {type: 'add'} });
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
    this.$set(this.checkList, index, !this.checkList[index])
  }
  cancelSelect() {
    this.isChecking = false;
    this.isFlag = false
  }
  initSelect(type: boolean) {
    this.checkList.forEach((value, index) => {
      this.$set(this.checkList, index, type);
    });
  }
  // 是否全选
  get isAllSelect() {
    return !this.checkList.includes(false)
  }
  handleClick(event: any) {
    if (event.clickType === "right") {
      if (this.sideBarShow)
        return
      else if (this.isChecking)
        this.initSelect(!this.isAllSelect) // 当前全选就变false，当前未全选就全true
      else
        this.isChecking = true
    } else {
      if (this.isChecking)
        this.cancelSelect()
      else
        this.sideBarShow = !this.sideBarShow
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